module.exports = (client, oldMember, newMember) => {
  
  // Check if points enabled
  const enabled = client.db.guildSettings.selectUsePoints.pluck().get(newMember.guild.id);
  const voiceEnabled = client.db.guildSettings.selectUseVoicePoints.pluck().get(newMember.guild.id);
  if (!enabled || !voiceEnabled) return;

  // Set IDs
  const oldId = oldMember.voiceChannelID;
  const newId = newMember.voiceChannelID;
  const afkId = newMember.guild.afkChannelID;

  if (oldId === newId) return;
  else if (
    oldId === afkId && newId || // Leaving AFK, joining channel
    !oldId && newId && newId !== afkId // Joining channel that is not AFK
  ) {
    newMember.interval = setInterval(() => {
      client.db.guildPoints.updatePoints.run({ points: 1 }, newMember.id, newMember.guild.id);
    }, 60000);
  }

  else if (
    oldId && oldId !== afkId && !newId || // Leaving voice chat
    oldId && newId === afkId // Leaving channel, joining AFK
  ) {
    clearInterval(oldMember.interval);
  }
};