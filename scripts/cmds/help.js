const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

// Rotate images 
let imageIndex = 0;
const images = [
  "https://files.catbox.moe/m77sfn.gif",
  "https://files.catbox.moe/i9etjw.gif",
  "https://i.imgur.com/s1z38No.jpg",
  "https://files.catbox.moe/3fp3vf.gif"
];

// Fancy small-caps mapping
const fancyMap = {
  a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ꜰ', g: 'ɢ', h: 'ʜ', i: 'ɪ',
  j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ',
  s: 'ꜱ', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'ˣ', y: 'ʏ', z: 'ᴢ'
};

// Convert normal string to fancy small-caps
function toFancySmallCaps(str) {
  return str.split("").map(c => fancyMap[c.toLowerCase()] || c).join("");
}

// 🔓 Role text helper
function roleTextToString(role) {
  switch (role) {
    case 0: return "Everyone";
    case 1: return "Group Admin";
    case 2: return "Bot Admin";
    case 3: return "Super Admin";
    default: return role.toString();
  }
}

module.exports = {
  config: {
    name: "help",
    version: "1.0",
    author: "Az ad 💥",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Show all commands (Stylish SMS Style)" },
    longDescription: { en: "Display all commands in a stylish bordered list" },
    category: "system"
  },

  onStart: async function ({ message, args, event }) {
    const prefix = getPrefix(event.threadID);

    // Rotate image      
    const currentImage = images[imageIndex];      
    imageIndex = (imageIndex + 1) % images.length;  

    // Command-specific info      
    if (args[0]) {      
      const cmdName = args[0].toLowerCase();      
      const aliasTarget = aliases.get(cmdName);    
      const command = commands.get(cmdName) || (aliasTarget && commands.get(aliasTarget));    
      if (!command) return message.reply(`💀👻 No such command: ${cmdName}`);      

      const { name, author, shortDescription, version, role } = command.config;      
      const desc = shortDescription?.en || "No description";      
      const usage = `Use: ${prefix}${name}`;      
      const infoBox = `╭───⊙

│ ☢️ ${toFancySmallCaps(name)}
├── INFO
│ 📝 Description: ${desc}
│ 🗿 Author: ${author || "Unknown"}
│ ⚙️ Guide: ${usage}
├── USAGE
│ 💠 Version: ${version || "1.0"}
│ 🔐 Role: ${roleTextToString(role)}
╰────────────⊙`;

      return message.reply({      
        body: infoBox,      
        attachment: await global.utils.getStreamFromURL(currentImage)      
      });      
    }      

    // Categorize commands      
    const categories = {};      
    for (const [name, cmd] of commands) {      
      const cat = cmd.config.category || "Uncategorized";      
      if (!categories[cat]) categories[cat] = [];      
      categories[cat].push(name);      
    }      

    // Nezuko header with sparkles      
    const sparkles = ["✦", "✧", "✰"];      
    const randSparkle = () => sparkles[Math.floor(Math.random() * sparkles.length)];      
    let msg = `╔════════════════════════╗

💫  🪽°${toFancySmallCaps("Nezuko Chan")}°🐰 ${randSparkle()} ${randSparkle()} ${randSparkle()}
╚════════════════════════╝\n`;

    // List commands by category with pagination (5 per page)
    const maxCategoryLength = Math.max(...Object.values(categories).map(c => c.length), 1);    
    for (const category of Object.keys(categories).sort()) {      
      const cmds = categories[category].sort();      
      const barLength = 10;      
      const filled = Math.min(barLength, Math.ceil((cmds.length / maxCategoryLength) * barLength));      
      const empty = barLength - filled;      
      const bar = `➪${"▮".repeat(filled)}${"▭".repeat(empty)}৺`;      

      msg += `\n╭─🌈 ${toFancySmallCaps("Category")}: ${toFancySmallCaps(category)} ─╮\n`;      
      msg += `${bar}\n`;      

      const bullets = ["〄", "✦", "💥", "🧬"];      
      for (let i = 0; i < cmds.length; i += 5) {
        const pageCmds = cmds.slice(i, i + 5);
        pageCmds.forEach((c, j) => {
          const bullet = bullets[(i + j) % bullets.length];
          msg += `   ${bullet} ${toFancySmallCaps(c)}\n`;
        });
        msg += `─── Page ${(i / 5) + 1}/${Math.ceil(cmds.length / 5)} ───\n`;
        msg += `👤 Dev: toby | 🤖 Bot: toma\n`;
        msg += `╰${"─".repeat(36)}╯\n`;
      }
    }

    // Footer with total commands, prefix, and dev info      
    msg += `\n╔════════════════════════════╗

💎 Total Commands: ${commands.size}
🔰 Prefix: ${prefix}
👤 Dev: Az ad 👻🩸
💡 Tip: Type '${prefix}help [command]' for detailed info.
╚════════════════════════════╝`;

    await message.reply({      
      body: msg,      
      attachment: await global.utils.getStreamFromURL(currentImage)      
    });
  }
};
