var Discord = require("discord.js");
var Client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Discord.Intents.FLAGS.DIRECT_MESSAGES,
    Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING,
  ],
  partials: ["CHANNEL"],
});

const config = require("./config.json");
const prefix = config.prefix;

//Statut du Bot

Client.on("ready", async () => {
  console.log(`${Client.user.username} est maintenant activé ! 🥀`);
  Client.user.setActivity(`Les agents du LSPD | .help`, { type: "WATCHING" });
});

//Rôle + Message D'arrivée !

Client.on("guildMemberAdd", async (member) => {
  const bienvenueembed = new Discord.MessageEmbed()
    .setAuthor({
      name: `Bienvenue`,
      iconURL: `${member.displayAvatarURL({ size: 16, dynamic: true })}`,
    })
    .setColor(`#000000ff`)
    .setDescription(
      `**<@${member.id}> a rejoint le serveur !\n\nBienvenue sur le serveur ${member.guild.name} \🥀**`
    )
    .setThumbnail(`${member.displayAvatarURL({ size: 16, dynamic: true })}`)
    .setTimestamp();
  Client.channels.cache.get(config.chan_bvn).send({ embeds: [bienvenueembed] });
  member.roles.add(config.role_citoyen);
  console.log(
    `${member.displayName} a rejoint le serveur ${member.guild.name}`
  );
});

Client.on("guildMemberRemove", async (member) => {
  const aurevoirembed = new Discord.MessageEmbed()
    .setColor(`RANDOM`)
    .setDescription(
      `**<@${member.id}> a quitté le serveur ${member.guild.name} !\n\nAu revoir \🥀**`
    )
    .setThumbnail(`${member.displayAvatarURL({ size: 16, dynamic: true })}`)
    .setTimestamp();
  Client.channels.cache.get(config.chan_bvn).send({ embeds: [aurevoirembed] });
  console.log(`${member.displayName} a quitté le serveur ${member.guild.name}`);
});

//Commandes Principales (prise, fin, casier, help)

let casier = new Map();

Client.on("messageCreate", async (message) => {
  if (
    message.author.bot ||
    !message.guild ||
    !message.content.startsWith(prefix)
  )
    return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command == "casier") {
    if (message.channel.id == config.chan_creation_casier) {
      if (message.member.roles.cache.has(config.role_lspd)) {
        message.delete();
        const casierCréé = await message.guild.channels.create(
          `📂|casier-${args[0]}-${args[1]}`,
          {
            type: "text",
            parent: "974345674273476618",
            permissionOverwrites: [
              {
                allow: "VIEW_CHANNEL",
                allow: "SEND_MESSAGES",
                id: config.role_lspd,
              },
            ],
          }
        );
        casier.set(message.author.id, true);
        casierCréé.send(
          `Le casier de ${args[0]} ${args[1]} a été créé par <@${message.author.id}>`
        );
        console.log(`Le casier de ${args[0]} ${args[1]} a été créé !`);
      }
    }
  }
});

Client.on("messageCreate", async (message) => {
  if (
    message.author.bot ||
    !message.guild ||
    !message.content.startsWith(prefix)
  )
    return;
  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  const serviceembed = new Discord.MessageEmbed()
    .setAuthor({
      name: `Un agent vient de prendre son service`,
      iconURL: `https://cdn.discordapp.com/attachments/968911909577437334/968935004505780264/LSPD.png`,
    })
    .setColor("#5579c6")
    .setDescription(`<@${message.author.id}> a pris son service.\\🌹`)
    .setTimestamp();

  const dejaenservice = new Discord.MessageEmbed()
    .setAuthor({
      name: `Erreur`,
      iconURL: `https://cdn.discordapp.com/attachments/968911909577437334/968935004505780264/LSPD.png`,
    })
    .setColor("#ff0000")
    .setDescription(`<@${message.author.id}> est déjà en service.\🥀`)
    .setTimestamp();

  const finservice = new Discord.MessageEmbed()
    .setAuthor({
      name: `Un agent vient de finir son service`,
      iconURL: `https://cdn.discordapp.com/attachments/968911909577437334/968935004505780264/LSPD.png`,
    })
    .setColor("#ff0000")
    .setDescription(`<@${message.author.id}> a fini son service.\🥀`)
    .setTimestamp();

  const pasenservice = new Discord.MessageEmbed()
    .setAuthor({
      name: `Erreur`,
      iconURL: `https://cdn.discordapp.com/attachments/968911909577437334/968935004505780264/LSPD.png`,
    })
    .setColor("#ff0000")
    .setDescription(`<@${message.author.id}> n'est pas en service.\🥀`)
    .setTimestamp();

  const helpembed = new Discord.MessageEmbed()
    .setAuthor({
      name: `Voici les commandes du serveur`,
      iconURL: `https://cdn.discordapp.com/attachments/968911909577437334/968935004505780264/LSPD.png`,
    })
    .setColor("#5579c6")
    .addFields(
      {
        name: `Commandes pour les agents`,
        value: `\u200b`,
      },
      {
        name: `\u200b`,
        value: `\u200b`,
      },
      {
        name: `Prendre son service :`,
        value: `.prise`,
        inline: true,
      },
      {
        name: `\u200b`,
        value: `\u200b`,
      },
      {
        name: `Finir son service :`,
        value: `.fin`,
        inline: true,
      },
      {
        name: `\u200b`,
        value: `\u200b`,
      },
      {
        name: `Créer un casier :`,
        value: `.casier nom prénom`,
        inline: true,
      },
      {
        name: `\u200b`,
        value: `\u200b`,
      },
      {
        name: `Commandes pour les agents de la <@&${config.role_police_academie}>`,
        value: `\u200b`,
      },
      { name: `\u200b`, value: `\u200b` },
      {
        name: `Accepter une candidature :`,
        value: `.accept + mention`,
        inline: true,
      },
      {
        name: `\u200b`,
        value: `\u200b`,
      },
      {
        name: `Mettre une candidature en attente :`,
        value: `.attente + mention`,
        inline: true,
      },
      { name: `\u200b`, value: `\u200b` },
      {
        name: `Refuser une candidature :`,
        value: `.refus + mention`,
        inline: true,
      }
    );

  if (message.member.roles.cache.has(config.role_lspd)) {
    if (command == "prise") {
      if (message.channel.id === config.chan_prise_de_service) {
        if (!message.member.roles.cache.has(config.role_en_service)) {
          message.channel.send({ embeds: [serviceembed] }), message.delete();
          message.member.roles.add("974345640744214528");
          console.log(`${message.author.username} a pris son service \🌹`);
        } else
          message.channel.send({ embeds: [dejaenservice] }), message.delete();
      } else
        message.reply(`Tu n'as pas fait la commande dans le bon channel.\🥀`);
    }
    if (command == "fin") {
      if (message.channel.id === config.chan_fin_de_service) {
        if (!message.member.roles.cache.has(config.role_en_service)) {
          message.channel.send({ embeds: [pasenservice] }), message.delete();
        } else message.channel.send({ embeds: [finservice] }), message.delete();
        message.member.roles.remove("974345640744214528");
        console.log(`${message.author.username} a fini son service 🥀`);
      } else
        message.reply(`Tu n'as pas fait la commande dans le bon channel.\🥀`);
    }
    if (command == "help") {
      message.channel.send({ embeds: [helpembed] });
    }
  }
});

//Suggestions

Client.on("messageCreate", (message) => {
  if (message.channel.id === config.chan_suggestions_civil) {
    message.react("<:thumbsupgrey:975124992972955701>");
    message.react("<:thumbsdowngray:975124958508363856>");
  }
  if (message.channel.id === config.chan_suggestions_gradé) {
    message.react("<:thumbsupgrey:975124992972955701>");
    message.react("<:thumbsdowngray:975124958508363856>");
  }
  if (message.channel.id === config.chan_suggestions_lspd) {
    message.react("<:thumbsupgrey:975124992972955701>");
    message.react("<:thumbsdowngray:975124958508363856>");
  }
});

//Commandes Police Académie

Client.on("messageCreate", (message) => {
  if (
    message.author.bot ||
    !message.guild ||
    !message.content.startsWith(prefix)
  )
    return;
  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();
  const mentionné = message.mentions.members.first();
  const mentionnérep = message.mentions.members;

  //Embeds

  const refusembed = new Discord.MessageEmbed()
    .setAuthor({
      name: `Votre candidature a été refusée`,
      iconURL: `https://cdn.discordapp.com/attachments/968911909577437334/968935004505780264/LSPD.png`,
    })
    .setColor("#5579c6")
    .setDescription(
      `Bonjour | Bonsoir, votre candidature a été refusée.\n\n Cela signifie que votre candidature ne nous a pas convaincue.\n\n Vous pourrez décider ou non de retenter votre chance dans une semaine.`
    )
    .setTimestamp();

  const acceptEmbed = new Discord.MessageEmbed()
    .setAuthor({
      name: `Votre candidature a été acceptée`,
      iconURL: `https://cdn.discordapp.com/attachments/968911909577437334/968935004505780264/LSPD.png`,
    })
    .setColor("#5579c6")
    .setDescription(
      `Bonjour | Bonsoir, votre candidature a été acceptée.\n\nFélicitations à vous, c'est la première étape de votre entrée au LSPD, vous avez maintenant accès au channel formations c'est là où sont communiquées les annonces pour les sessions de recrutement qui incluent des test physiques et un test écrit.\n\nBon courage à vous et à très bientôt je l'espère.`
    )
    .setTimestamp();

  const logsrefus = new Discord.MessageEmbed()
    .setAuthor({
      name: `Une candidature a été refusée`,
      iconURL: `https://cdn.discordapp.com/attachments/968911909577437334/968935004505780264/LSPD.png`,
    })
    .setColor("WHITE")
    .addFields(
      { name: `Candidature de :`, value: `${mentionné}` },
      { name: `Refusée par :`, value: `<@${message.author.id}>` }
    )
    .setTimestamp();

  const logsaccept = new Discord.MessageEmbed()
    .setAuthor({
      name: `Une candidature a été acceptée`,
      iconURL: `https://cdn.discordapp.com/attachments/968911909577437334/968935004505780264/LSPD.png`,
    })
    .setColor("WHITE")
    .addFields(
      { name: `Candidature de :`, value: `${mentionné}` },
      { name: `Acceptée par :`, value: `<@${message.author.id}>` }
    )
    .setTimestamp();

  if (command == "accept") {
    if (
      message.member.roles.cache.has(config.role_police_academie) ||
      message.member.roles.cache.has(config.role_police_academie_chef) ||
      message.member.roles.cache.has(config.role_police_academie_superviseur)
    ) {
      if (message.channel.id == config.chan_resultat_entretien) {
        if (!mentionné || message.mentions.users.bot) return;
        if (mentionné.roles.cache.has(config.role_lspd)) return;
        mentionné.roles.add(config.role_candidature_acceptee);
        console.log(`${mentionné.user.username} a été accepté(e)`);
        Client.channels.cache
          .get(config.chan_logs_accept)
          .send({ embeds: [logsaccept] });
        mentionnérep
          .forEach((mentionnérep) =>
            mentionnérep.send({ embeds: [acceptEmbed] })
          )
          .catch(() =>
            message.reply(`Je ne peux pas envoyer de dm à cette personne.`)
          );
      } else message.reply(`Tu n'as pas fait la commande dans le bon channel.`);
    } else
      message.reply(
        `Tu ne peux pas faire cette commande tu dois faire parti de la division Police Académie.`
      );
  }
  if (command == "refus") {
    if (!mentionné || message.mentions.users.bot) return;
    if (mentionné.roles.cache.has(config.role_lspd)) return;
    mentionné.roles.set([config.role_citoyen, config.role_refus_entretien]);
    mentionnérep.forEach((mentionnérep) =>
      mentionnérep.send({ embeds: [refusembed] })
    );
    console.log(`${mentionné.user.username} a été refusé(e)`);
    Client.channels.cache
      .get(config.chan_logs_refus)
      .send({ embeds: [logsrefus] });
  }
  if (command == "cadet") {
    if (!mentionné || message.mentions.users.bot) return;
    if (mentionné.roles.cache.has(config.role_lspd)) return;
    mentionné.roles.set([config.role_lspd, config.role_cadet]);
    mentionné.setNickname(`[CDT-00] ${mentionné.nickname}`);
  }
  if(command == 'ticket'){
    const menueEmbed = new Discord.MessageEmbed()
      .setAuthor({name : `Contacter l'administration`, iconURL : ``})
      .setDescription(`Une question ? \n\nFaites votre choix ci-dessous !`)
      .setColor('#5579c6')
      .setImage(`https://cdn.discordapp.com/attachments/976839496798703686/976839529929515048/dashboard.jpg`)
    var row = new Discord.MessageActionRow()
      .addComponents(
        new Discord.MessageSelectMenu()
          .setCustomId('test')
          .setPlaceholder('selectionne test')
          .addOptions([
              {
                label : '📁 Recrutement',
                description : 'Une question concernant les recrutements',
                value : 'recrutement'
              },
              {
                label : '❗ Plainte',
                description : 'Une plainte envers un ou des agents de police',
                value : 'plainte'
              },
              {
                label : '❓ Autre',
                description : 'Ouvrir un ticket pour une demande spécifique',
                value : 'autre'
              }
          ])
      );

      message.channel.send({embeds : [menueEmbed], components : [row]})
  }
  if(command == 'close'){
    if(message.channel.topic == 'ticket'){
      if(message.member.roles.cache.has(config.role_support) || message.member.roles.cache.has(config.role_staff) || message.member.roles.cache.has(config.role_police_academie) || message.member.roles.cache.has(config.role_police_academie_chef) || message.member.roles.cache.has(config.role_police_academie_superviseur) || message.member.roles.cache.has(config.role_superviseur) || message.member.roles.cache.has(config.role_etat_major)){
        message.channel.delete()
      }
    }
  }
  if (command == "reglement") {
    if (message.author.id === "368778701401358336") {
      const regEmbed = new Discord.MessageEmbed()
        .setAuthor({
          name: `\🌹 Règlement Los Santos Police Department`,
          iconURL: `https://cdn.discordapp.com/attachments/968911909577437334/968935004505780264/LSPD.png`,
        })
        .setColor("#0000")
        .setDescription(
          `En tant que membre des forces de lordre vous devez montrer l'exemple. Pour se faire, des règles de bases sont de mises, telles que `
        )
        .setImage('https://cdn.discordapp.com/attachments/959610705550667817/967161901584883742/dashboard.jpg')
        .addFields(
          {
            name: `\\🌹 Conduite`,
            value: `Votre conduite doit être irréprochable, vous devez mettre une limite d'au moins **3 secondes** sur un **feu rouge ou un stop**\n\nVous devez limiter votre vitesse à **80km/h** en ville, **120km/h** sur l'autoroute.\n\nPour dépasser ces limitations vous devez être au minimum en **Code 2**.`,
          },
          {
            name: `\\🌹 Violence`,
            value: `La violence venant de la part des forces de l'ordre est à éviter au maximum, en tant que policier vous devez **privilégier la parole.** Vous devez exercer une force égale à celle donnée tout en privilégiant la parole.\n\nSi vous êtes menacé avec une batte vous allez sortir votre **Tazer**, si vous êtes menacé avec une arme létale vous devez sortir votre **Arme à feu**. Vous devez toujours penser à 'Neutraliser' la menace et pas directement à la **Tuer**.`,
          },
          {
            name: `\\🌹 Fouille`,
            value: `Le respect est **primordial** afin d'instaurer un climat de confiance entre les citoyens et les agents. Un agent des forces de l'ordre peut être autant sanctionné qu'un civil il faut garder cela à l'esprit et ne pas abuser des pouvoirs conférés. Il faut aussi se respecter entre agents du **LSPD**\n\nNous ne vous obligeons pas à vous apprécier et à devenir meilleurs amis mais nous vous obligeons à adopter un comportement exemplaire qui suscite le respect devant les civils et en interne pour instaurer une bonne ambiance au sein du **LSPD**, afin d'éviter des problèmes importants, en radio vous devez parler correctement, un système de **Push to talk** est nécessaire en radio afin de ne pas déranger les autres agents.`,
          },
          {
            name: `\\🌹 Patrouille`,
            value: `Les patrouilles se font à **deux minimum.** Les patrouilles à **2 cadets** sont interdites, vous devez obligatoirement être avec un supérieur au minimum **Po I.**\n\nDurant les patrouilles vous devez rester disponibles en radio, prendre des civils sans aucune raison valable dans son véhicule est **interdit** et lourdement sanctionnable.\n\nPour maximiser l'entente et la **coordination** les calls radio seront effectués par le **passager** en tout circonstances. Le conducteur doit se concentrer sur sa **conduite.**`,
          },
          {
            name: `\\🌹 Organisation`,
            value: `Après avoir fini votre **service** vous devez faire votre **rapport** en suivant l'exemple dans <#974345807891419156>.\n\nLa création de casier se fait via la commande **.casier Nom Prénom** qui créé un channel automatiquement ou vous pourrez mettre les **Chef(s) d'accusation** ou la **Mise en détention complète**`,
          }
        );
        message.channel.send({embeds : [regEmbed]})
    }
  }
});

//Commandes fun
const malScraper = require("mal-scraper");
const moment = require("moment");
let ticket = new Map()

Client.on("messageCreate", async (message) => {
  if (
    message.author.bot ||
    !message.guild ||
    !message.content.startsWith(prefix)
  )
    return;
  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if (command == "8ball") {
    function doMagic8BallVoodoo() {
      var rand = [
        "Oui",
        "Non",
        "Pourquoi t'essaies encore ?",
        `A quoi tu penses ? Non, évidemment.`,
        "Peut-être",
        "Jamais",
        "Ouaip",
      ];

      return rand[Math.floor(Math.random() * rand.length)];
    }

    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    }
    
    var msg1 = Array(5);
    msg1[1] = "Oui";
    msg1[2] = "Non";
    msg1[3] = "Peut-être";
    msg1[4] = "Sans aucun doute";
    msg1[5] = "Je m'en fiche";
    msg1[6] = "c:";
    var x = getRandomInt(0, 20);
    if (x < 5) {
      if (x < 3) {
        message.channel.send(msg1[1]);
      } else {
        message.channel.send(msg1[3]);
      }
    } else if (x <= 9) {
      if (x >= 7) {
        message.channel.send(msg1[2]);
      } else {
        message.channel.send(msg1[4]);
      }
    } else if (x <= 12) {
      message.channel.send(msg1[5]);
    } else {
      message.channel.send(msg1[6]);
    }
  }

  if (command == "serverinfo") {
    const servericon = message.guild.iconURL();
    const serverembed = new Discord.MessageEmbed()
      .setAuthor({
        name: `Information de ${message.guild.name}`,
        iconURL: `${servericon}`,
      })
      .setColor(`#00000`)
      .setThumbnail(servericon)
      .addFields(
        { name: `\\🌹 Nom du serveur`, value: `${message.guild.name}` },
        { name: `\\🌹 Propriétaire`, value: `<@${message.guild.ownerId}>` },
        {
          name: `\\🌹 Nombre de Channels`,
          value: `${message.guild.channels.cache.size}`,
        },
        { name: `\\🌹 Rôles`, value: `${message.guild.roles.cache.size}` },
        {
          name: `\\🌹 Créé le`,
          value: moment(message.guild.createdAt).format(
            `[Le] DD|MM|YYYY [à] HH:mm:ss`,
            true
          ),
        },
        { name: `\\🌹 Total des membres`, value: `${message.guild.memberCount}` }
      )
      .setTimestamp();
    message.channel.send({ embeds: [serverembed] }), message.delete();
  }

  if (command == "anime") {
    const search = `${args}`;
    if (!search)
      return message.reply(`Tu dois mettre le nom de l'anime que tu cherches.`);

    malScraper.getInfoFromName(search).then((data) => {
      const malEmbed = new Discord.MessageEmbed()
        .setAuthor({
          name: `Résultat de la recherche de ma liste d'animes pour ${args}`
            .split(",")
            .join(" "),
        })
        .setThumbnail(data.picture)
        .setColor("#a2a2ff")
        .addField("🌹 Titre en anglais", data.englishTitle, true)
        .addField("🌹 Titre en japonais", data.japaneseTitle, true)
        .addField("🌹 Type", data.type, true)
        .addField("🌹 Episodes", data.episodes, true)
        .addField("🌹 Note", data.rating, true)
        .addField("🌹 Diffusé", data.aired, true)
        .addField("🌹 Score", data.scoreStats, true)
        .addField("🌹 Lien", data.url);

      message.channel.send({ embeds: [malEmbed] });
    });
  }

  if (command == "userinfo") {
    const member = message.mentions.members.first() || message.member;
    const userinfoEmbed = new Discord.MessageEmbed()
      .setColor(`#00000`)
      .addField("\\🌹 Tag", member.user.tag, true)
      .setAuthor({
        name: `Information de ${member.user.username}`,
        iconURL: `${member.displayAvatarURL({ size: 32, dynamic: true })}`,
      })
      .addField(`\\🌹 Pseudo`, `${member.displayName}`)
      .addField(`\\🌹 Discord Tags`, `${member.user.tag}`)
      .addField(
        "\\🌹 Date de création du compte",
        moment(member.user.createdAt).format(`[Le] DD|MM|YYYY [à] HH:mm:ss`)
      )
      .addField(
        "\\🌹 Date d'arrivée sur le serveur",
        moment(member.joinedAt).format(`[Le] DD|MM|YYYY [à] HH:mm:ss`)
      )
      .addField(
        "\\🌹 Date du début de boost",
        member.premiumSince
          ? moment(member.premiumSince).format(`[Le] DD|MM|YYYY [à] HH:mm:ss`)
          : "Ne boost pas"
      )
      .addField(
        `\\🌹 Rôles [${member.roles.cache.size}]`,
        member.roles.cache.map((roles) => `${roles}`).join(" | "),
        true
      )
      .setThumbnail(member.user.displayAvatarURL())
      .setFooter({ text: `ID : ${member.id}` });
    message.channel.send({ embeds: [userinfoEmbed] }), message.delete();
  }
});

Client.on('interactionCreate',  interaction => {
  if(interaction.isSelectMenu()){
    if(interaction.customId == 'test'){
      if(interaction.values == 'recrutement'){
        interaction.guild.channels.create(`📁|ticket-recrutement-${interaction.user.username}`, {
          type : 'text',
          parent : '974345661371785346',
          permissionOverwrites : [
            {
              allow : ['VIEW_CHANNEL', 'SEND_MESSAGES'],
              id : interaction.user.id
            },
            {
              allow : ['VIEW_CHANNEL', 'SEND_MESSAGES'],
              id : interaction.guild.roles.cache.get(config.role_police_academie),
            },
            {
              deny : 'VIEW_CHANNEL',
              id : interaction.guild.id
            },
            {
              allow : ['VIEW_CHANNEL', 'SEND_MESSAGES'],
              id : interaction.guild.roles.cache.get(config.role_police_academie_chef),
            },
            {
              allow : ['VIEW_CHANNEL', 'SEND_MESSAGES'],
              id : interaction.guild.roles.cache.get(config.role_police_academie_superviseur)
            },
            {
              allow : ['VIEW_CHANNEL', 'SEND_MESSAGES'],
              id : interaction.guild.roles.cache.get(config.role_police_academie_superviseur)
            }
          ]
        })
        .then(
          (channel) => {
            channel.setTopic('ticket');
            ticket.set(interaction.user.id, true)
            const embed = new Discord.MessageEmbed()
              .setColor('#5579c6')
              .setDescription(`**Bonjour, veuillez nous faire parvenir votre question concernant les recrutements <@${interaction.user.id}>**`)
            channel.send({embeds : [embed]})
          }
        )
      }
      if(interaction.values == 'plainte'){
        interaction.guild.channels.create(`📁|ticket-plainte-${interaction.user.username}`, {
          type : 'text',
          parent : '974345661371785346',
          permissionOverwrites : [
            {
              allow : ['VIEW_CHANNEL', 'SEND_MESSAGES'],
              id : interaction.user.id
            },
            {
              allow : ['VIEW_CHANNEL', 'SEND_MESSAGES'],
              id : interaction.guild.roles.cache.get(config.role_staff)
            },
            {
              deny : 'VIEW_CHANNEL',
              id : interaction.guild.id
            },
            {
              allow : ['VIEW_CHANNEL', 'SEND_MESSAGES'],
              id : interaction.guild.roles.cache.get(config.role_support)
            },
            {
              allow : ['VIEW_CHANNEL', 'SEND_MESSAGES'],
              id : interaction.guild.roles.cache.get(config.role_superviseur)
            }
          ]
        })
        .then(
          (channel) => {
            channel.setTopic('ticket')
            ticket.set(interaction.user.id, true)
            const embed = new Discord.MessageEmbed()
              .setColor('#5579c6')
              .setDescription(`**Bonjour, veuillez nous faire parvenir votre plainte <@${interaction.user.id}>**`)
            channel.send({embeds : [embed]})
          }
        )
      }
      if(interaction.values == 'autre'){
        interaction.guild.channels.create(`📁|ticket-${interaction.user.username}`, {
          type : 'text',
          parent : '974345661371785346',
          permissionOverwrites : [
            {
              allow : ['VIEW_CHANNEL', 'SEND_MESSAGES'],
              id : interaction.user.id
            },
            {
              allow : ['VIEW_CHANNEL', 'SEND_MESSAGES'],
              id : interaction.guild.roles.cache.get(config.role_superviseur)
            },
            {
              deny : 'VIEW_CHANNEL',
              id : interaction.guild.id
            },
            {
              allow : ['VIEW_CHANNEL', 'SEND_MESSAGES'],
              id : interaction.guild.roles.cache.get(config.role_support),
            },
            {
              allow : ['VIEW_CHANNEL', 'SEND_MESSAGES'],
              id : interaction.guild.roles.cache.get(config.role_staff)
            }
          ]
        })
        .then(
          (channel) => {
            channel.setTopic('ticket')
            ticket.set(interaction.user.id, true)
            const embed = new Discord.MessageEmbed()
              .setColor('#5579c6')
              .setDescription(`**Bonjour, veuillez nous faire parvenir votre question <@${interaction.user.id}>**`)
            channel.send({embeds : [embed]})
          }
        )
      }
    }
  }
});

let ticketrec = new Map()

Client.on('messageCreate', async message => {
  if(message.author.bot) return;
  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();
  if(message.channel.id == config.chan_faire_un_ticket){
    message.delete()
    const ticketrecChannel = message.guild.channels.cache.find(c => c.name.toLowerCase() === `ticket-division-${message.author.username}`.toLowerCase())
    if(ticketrecChannel || ticket.get(message.author.id) === true) return message.channel.send(`Tu as déjà un ticket ouvert <@${message.author.id}>`)
    const ticketrecCree = await message.guild.channels.create(`🔎|ticket-division-${message.author.username}`, {
      type : 'text',
      parent : '976871279405711370',
      permissionOverwrites : [
        {
          allow : ['VIEW_CHANNEL', 'SEND_MESSAGES'],
          id : message.author.id,
          id : message.guild.roles.cache.get(config.role_swat_division_superviseur),
          id : message.guild.roles.cache.get(config.role_police_academie_superviseur),
          id : message.guild.roles.cache.get(config.role_training_division_superviseur),
          id : message.guild.roles.cache.get(config.role_detective_division_superviseur),
          id : message.guild.roles.cache.get(config.role_superviseur)
        },
        {
          deny : 'VIEW_CHANNEL',
          id : message.guild.id
        }
      ]
    })
    .then(
      (channel) => {
        channel.setTopic('ticket')
        ticketrec.set(message.author.id, true)
        channel.send(`Tu peux maintenant nous envoyer ta candidature <@${message.author.id}>`)
      }
    )
  }
})

//Rapport

Client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  const repuser = message.mentions.members;

  if (message.channel.type == "DM") {
    const rapportEmbed = new Discord.MessageEmbed()
      .setAuthor({
        name: `Nouveau rapport reçu`,
        iconURL: `https://cdn.discordapp.com/attachments/968911909577437334/968935004505780264/LSPD.png`,
      })
      .setColor(`#5579c6`)
      .setDescription(
        `${message.content}\n\nRapport de <@${message.author.id}>`
      )
      .setTimestamp();

    const rapportlogsEmbed = new Discord.MessageEmbed()
      .setColor(`#000000ff`)
      .setDescription(
        `Rapport fait par <@${message.author.id}>\n${moment(
          message.createdAt
        ).format(`[Le] DD/MM/YYYY [à] HH:mm:ss`)}`
      );
    Client.channels.cache
      .get(config.chan_rapports_envoyés)
      .send({ embeds: [rapportEmbed] });
    Client.channels.cache
      .get(config.chan_logs_rapport)
      .send({ embeds: [rapportlogsEmbed] });
  }
  if (command == "rep") {
    if (message.channel.id === config.chan_rapports_réponses) {
      if (!repuser) {
        return message.reply(`Tu dois mentionner un utilisateur.`);
      }
      if (!message.mentions.users.bot) {
        const reponse = args.slice(prefix.length, repuser.length).join(" ");
        if (!reponse) return message.reply(`Tu dois écrire une réponse`);
        const rapportrepEmbed = new Discord.MessageEmbed()
          .setAuthor({ name: `Réponse`, iconURL: `` })
          .setColor("#5579c6")
          .setDescription(reponse)
          .setFooter({
            text: `Rapport répondu par ${message.member.displayName}`,
          });
        setTimestamp();

        repuser.forEach((repuser) =>
          repuser.send({ embeds: [rapportrepEmbed] })
        );
        message.reply(
          `Réponse envoyée avec succès <:verified:975151404949860422>`
        );
      }
    }
  }
});


Client.login(config.token);
