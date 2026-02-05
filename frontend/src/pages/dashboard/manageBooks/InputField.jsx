import React from 'react';

const InputField = ({ label, name, type = 'text', register, placeholder }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-slate-700">{label}</label>
      <input
        type={type}
        {...register(name,  { required: true })}
        className="w-full px-3 py-2 bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-white/80"
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputField;
