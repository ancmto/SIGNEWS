import React from 'react';

const Badge = ({ icon, text }) => (
  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
    <span className="text-purple-200 flex items-center">{icon}</span>
    <span className="text-sm font-medium">{text}</span>
  </div>
);

export default Badge;
