const User = require('./user.model');

exports.getUserProfile = async (req, res) => {
  try {
    const { uid } = req.params;

    console.log('📥 Getting profile for UID:', uid);

    if (!uid) {
      return res.status(400).json({ message: 'UID is required' });
    }

    const user = await User.findOne({ uid }).select('-password -mfaSecret');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      uid: user.uid,
      email: user.email,
      name: user.name,
      username: user.username,
      phone: user.phone,
      addresses: user.addresses,
      avatar: user.avatar,
      demographics: user.demographics,
      role: user.role,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt
    });
  } catch (err) {
    console.error('❌ Error fetching user profile:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { uid } = req.params;
    const updateBody = req.body;

    console.log('📥 Update profile request for UID:', uid);
    console.log('📦 Update data received:', JSON.stringify(updateBody, null, 2));

    if (!uid) {
      return res.status(400).json({ message: 'UID is required' });
    }

    // Find the user first
    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // FIX: Check if name field is currently a string and needs conversion
    const nameIsString = typeof user.name === 'string';

    if (nameIsString) {
      console.log('⚠️ Name field is a string, converting to object structure');
    }

    // Prepare update data
    const updateData = {};

    // Handle name updates - COMPLETE REPLACEMENT instead of nested update
    if (updateBody.name) {
      if (typeof updateBody.name === 'object') {
        // If name is sent as object, use it directly
        updateData.name = {
          firstName: updateBody.name.firstName || '',
          lastName: updateBody.name.lastName || ''
        };
      } else if (typeof updateBody.name === 'string') {
        // If name is string, parse it
        const nameParts = updateBody.name.trim().split(' ');
        updateData.name = {
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || ''
        };
      }
    } else if (updateBody.firstName !== undefined || updateBody.lastName !== undefined) {
      // Support direct firstName/lastName fields
      updateData.name = {
        firstName: updateBody.firstName || (typeof user.name === 'object' ? user.name.firstName : ''),
        lastName: updateBody.lastName || (typeof user.name === 'object' ? user.name.lastName : '')
      };
    } else if (nameIsString) {
      // If name wasn't provided but is currently a string, convert it
      const nameParts = user.name.trim().split(' ');
      updateData.name = {
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || ''
      };
    }

    // Handle username
    if (updateBody.username) {
      updateData.username = updateBody.username;
    }

    // Handle phone updates - COMPLETE REPLACEMENT
    if (updateBody.phone) {
      if (typeof updateBody.phone === 'object') {
        updateData.phone = {
          primary: updateBody.phone.primary || '',
          secondary: updateBody.phone.secondary || ''
        };
      } else if (typeof updateBody.phone === 'string') {
        updateData.phone = {
          primary: updateBody.phone,
          secondary: user.phone?.secondary || ''
        };
      }
    } else if (updateBody.primaryPhone !== undefined || updateBody.secondaryPhone !== undefined) {
      updateData.phone = {
        primary: updateBody.primaryPhone !== undefined ? updateBody.primaryPhone : (user.phone?.primary || ''),
        secondary: updateBody.secondaryPhone !== undefined ? updateBody.secondaryPhone : (user.phone?.secondary || '')
      };
    }

    // Handle demographics - COMPLETE REPLACEMENT
    if (updateBody.demographics) {
      updateData.demographics = {
        dateOfBirth: updateBody.demographics.dateOfBirth || user.demographics?.dateOfBirth || null,
        gender: updateBody.demographics.gender || user.demographics?.gender || 'prefer-not-to-say'
      };
    }

    // Handle avatar/picture
    if (updateBody.avatar) {
      updateData.avatar = updateBody.avatar;
    }
    if (updateBody.picture) {
      updateData.avatar = updateBody.picture;
    }

    // Update lastUpdated
    updateData.lastUpdated = new Date();

    console.log('💾 Final update data:', JSON.stringify(updateData, null, 2));

    // Perform update using $set with complete field replacement
    const updatedUser = await User.findOneAndUpdate(
      { uid },
      { $set: updateData },
      {
        new: true,
        runValidators: true,
        strict: false // Allow flexible schema updates
      }
    ).select('-password -mfaSecret');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found after update' });
    }

    console.log('✅ User profile updated successfully:', updatedUser.email);

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (err) {
    console.error('❌ Error updating profile:', err);
    console.error('Error stack:', err.stack);

    // Provide helpful error messages
    let errorMessage = 'Server error';

    if (err.code === 28 && err.codeName === 'PathNotViable') {
      errorMessage = 'Database schema conflict. Your profile data needs migration.';
    }

    res.status(500).json({
      message: errorMessage,
      error: err.message,
      code: err.code,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const { uid } = req.params;
    const addressData = req.body;

    console.log('📥 Adding address for UID:', uid);

    if (addressData.isDefault) {
      await User.updateOne(
        { uid },
        { $set: { 'addresses.$[].isDefault': false } }
      );
    }

    const user = await User.findOneAndUpdate(
      { uid },
      { $push: { addresses: addressData } },
      { new: true, runValidators: true }
    ).select('-password -mfaSecret');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ Address added successfully');

    res.status(200).json({
      message: 'Address added successfully',
      addresses: user.addresses
    });
  } catch (err) {
    console.error('❌ Error adding address:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const { uid, addressId } = req.params;
    const addressData = req.body;

    console.log('📥 Updating address for UID:', uid, 'Address ID:', addressId);

    if (addressData.isDefault) {
      await User.updateOne(
        { uid },
        { $set: { 'addresses.$[].isDefault': false } }
      );
    }

    const user = await User.findOneAndUpdate(
      { uid, 'addresses._id': addressId },
      { $set: { 'addresses.$': addressData } },
      { new: true, runValidators: true }
    ).select('-password -mfaSecret');

    if (!user) {
      return res.status(404).json({ message: 'User or address not found' });
    }

    console.log('✅ Address updated successfully');

    res.status(200).json({
      message: 'Address updated successfully',
      addresses: user.addresses
    });
  } catch (err) {
    console.error('❌ Error updating address:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const { uid, addressId } = req.params;

    console.log('📥 Deleting address for UID:', uid, 'Address ID:', addressId);

    const user = await User.findOneAndUpdate(
      { uid },
      { $pull: { addresses: { _id: addressId } } },
      { new: true }
    ).select('-password -mfaSecret');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ Address deleted successfully');

    res.status(200).json({
      message: 'Address deleted successfully',
      addresses: user.addresses
    });
  } catch (err) {
    console.error('❌ Error deleting address:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



exports.syncAuth0User = async (req, res) => {
  try {
    const { sub, email, name, nickname, picture, phone_number } = req.body;

    if (!sub || !email) {
      return res.status(400).json({ message: 'Invalid Auth0 user data' });
    }

    console.log('🔄 Syncing Auth0 user:', { sub, email, name });

    let firstName = name || nickname || email.split('@')[0];
    let lastName = 'User'; // ✅ IMPORTANT DEFAULT

    if (name && name.includes(' ')) {
      const parts = name.trim().split(' ');
      firstName = parts[0];
      lastName = parts.slice(1).join(' ') || 'User';
    }

    let user = await User.findOne({ uid: sub });

    if (user) {
      user.lastLoginAt = new Date();
      await user.save();

      console.log('✅ Existing user synced:', user.email);
      return res.status(200).json({ user });
    }

    user = await User.create({
      uid: sub,
      role: 'user',
      email,
      username: nickname || firstName,
      avatar: picture || '',
      phone: phone_number ? { primary: phone_number } : undefined,
      name: {
        firstName,
        lastName, // ✅ NEVER EMPTY
      },
      lastLoginAt: new Date(),
    });

    console.log('✅ New user created:', user.email);

    res.status(201).json({ user });

  } catch (err) {
    console.error('❌ User sync failed:', err.message);
    console.error(err.errors);

    res.status(500).json({
      message: 'User sync failed',
      error: err.message,
      details: err.errors
        ? Object.keys(err.errors).map(key => ({
          field: key,
          message: err.errors[key].message,
        }))
        : null,
    });
  }
};


