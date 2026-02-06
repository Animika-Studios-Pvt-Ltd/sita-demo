const Podcast = require("./podcast.model");
const { uploadToCloudinary } = require("../config/cloudinary");

const slugify = (str) =>
    str
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, "-")
        .replace(/^-+|-+$/g, "");

const createPodcast = async (req, res) => {
    try {
        const { title, description, podcastLink, releaseDate, host } = req.body;
        let thumbnailUrl = null;

        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, "podcasts");
            thumbnailUrl = result.secure_url;
        }

        let baseSlug = slugify(title);
        let slug = baseSlug;
        let suffix = 1;
        while (await Podcast.findOne({ slug })) {
            slug = `${baseSlug}-${suffix++}`;
        }

        const newPodcast = new Podcast({
            title,
            slug,
            description,
            thumbnail: thumbnailUrl,
            podcastLink,
            releaseDate: releaseDate || Date.now(),
            host,
        });

        await newPodcast.save();
        res.status(200).send({ message: "Podcast created successfully", podcast: newPodcast });
    } catch (error) {
        console.error("❌ Failed to create podcast:", error);
        res.status(500).send({ message: "Failed to create podcast", error: error.message });
    }
};

const getAllPodcasts = async (req, res) => {
    try {
        const podcasts = await Podcast.find().sort({ releaseDate: -1 });
        res.status(200).send(podcasts);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to fetch podcasts" });
    }
};

const getSinglePodcast = async (req, res) => {
    try {
        const { slug } = req.params;
        let podcast = await Podcast.findOne({ slug });
        if (!podcast) {
            podcast = await Podcast.findById(slug);
        }

        if (!podcast) return res.status(404).send({ message: "Podcast not found" });

        res.status(200).send(podcast);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to fetch podcast" });
    }
};

const updatePodcast = async (req, res) => {
    try {
        const { slug } = req.params;
        const updateData = { ...req.body };

        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, "podcasts");
            updateData.thumbnail = result.secure_url;
        }

        let podcast = await Podcast.findOne({ slug });
        if (!podcast) {
            podcast = await Podcast.findById(slug);
        }

        if (!podcast) return res.status(404).send({ message: "Podcast not found" });

        const updatedPodcast = await Podcast.findByIdAndUpdate(
            podcast._id,
            updateData,
            { new: true }
        );

        res.status(200).send({ message: "Podcast updated successfully", podcast: updatedPodcast });
    } catch (error) {
        console.error("❌ Failed to update podcast:", error);
        res.status(500).send({ message: "Failed to update podcast", error: error.message });
    }
};

const deletePodcast = async (req, res) => {
    try {
        const { slug } = req.params;

        let podcast = await Podcast.findOne({ slug });
        if (!podcast) {
            podcast = await Podcast.findById(slug);
        }

        if (!podcast) return res.status(404).send({ message: "Podcast not found" });

        await Podcast.findByIdAndDelete(podcast._id);

        res.status(200).send({ message: "Podcast deleted successfully", podcast });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to delete podcast" });
    }
};

const suspendPodcast = async (req, res) => {
    try {
        const { slug } = req.params;

        let podcast = await Podcast.findOne({ slug });
        if (!podcast) {
            podcast = await Podcast.findById(slug);
        }

        if (!podcast) return res.status(404).send({ message: "Podcast not found" });

        podcast.suspended = !podcast.suspended;
        await podcast.save();

        res.status(200).send({
            message: `Podcast ${podcast.suspended ? "suspended" : "active"}`,
            podcast,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to update podcast suspension" });
    }
};

module.exports = {
    createPodcast,
    getAllPodcasts,
    getSinglePodcast,
    updatePodcast,
    deletePodcast,
    suspendPodcast,
};
