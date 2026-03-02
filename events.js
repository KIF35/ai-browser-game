import { clamp, randomChoice } from "./engine.js";

function baseEvent(state) {
  const hungry = state.supplies <= 20;
  const exhausted = state.energy <= 30;
  const hopeless = state.hope <= 35;

  if (hungry && exhausted) {
    return randomChoice([wolfPack, scavengerAftermath]);
  }
  if (hopeless) {
    return randomChoice([radioSignal, strangerAtCamp, moraleCrisis]);
  }
  if (exhausted) {
    return randomChoice([stormApproaching, repairCamp]);
  }
  if (hungry) {
    return randomChoice([supplyCrates, huntingGrounds, ruinDive]);
  }
  return randomChoice([supplyCrates, strangerAtCamp, stormApproaching, ruinDive, radioSignal]);
}

export function getEvent(state) {
  return baseEvent(state)(state);
}

function wolfPack() {
  return {
    description: "A wolf pack circles your camp.",
    choices: [
      {
        label: "Defend the perimeter",
        resolve: (s) => {
          const win = Math.random() > 0.55;
          if (win) {
            s.energy -= 10;
            s.supplies -= 5;
            s.hope += 8;
            return { description: "You fend them off, but it costs you energy.", ended: false };
          } else {
            s.energy -= 25;
            s.supplies -= 12;
            s.hope -= 10;
            return { description: "You survive, badly shaken and depleted.", ended: false };
          }
        },
      },
      {
        label: "Abandon camp and run",
        resolve: (s) => {
          s.energy -= 18;
          s.supplies -= 20;
          s.hope -= 5;
          return { description: "You escape, but lose supplies and stability.", ended: false };
        },
      },
    ],
  };
}

function scavengerAftermath() {
  return {
    description: "Scavengers raided nearby camps overnight. You hear distant shouting.",
    choices: [
      {
        label: "Investigate carefully",
        resolve: (s) => {
          const good = Math.random() > 0.4;
          if (good) {
            s.energy -= 8;
            s.supplies += 15;
            s.hope += 5;
            return { description: "You recover abandoned supplies and return safely.", ended: false };
          }
          s.energy -= 12;
          s.hope -= 12;
          return { description: "It was a trap. You escape shaken.", ended: false };
        },
      },
      {
        label: "Fortify your own camp",
        resolve: (s) => {
          s.energy -= 6;
          s.supplies -= 5;
          s.hope += 3;
          return { description: "You invest energy into security. It’s slower, but safer.", ended: false };
        },
      },
    ],
  };
}

function supplyCrates() {
  return {
    description: "A supply crate parachutes down nearby. It might be trapped.",
    choices: [
      {
        label: "Open it",
        resolve: (s) => {
          const good = Math.random() > 0.35;
          if (good) {
            s.supplies += 25;
            s.hope += 8;
            return { description: "Lucky haul: food and batteries.", ended: false };
          }
          s.energy -= 15;
          s.hope -= 10;
          return { description: "The crate was booby-trapped. You survive, injured.", ended: false };
        },
      },
      {
        label: "Ignore it",
        resolve: (s) => {
          s.hope -= 2;
          return { description: "You stay safe, but that opportunity weighs on you.", ended: false };
        },
      },
    ],
  };
}

function huntingGrounds() {
  return {
    description: "You find tracks leading into the woods.",
    choices: [
      {
        label: "Hunt",
        resolve: (s) => {
          s.energy -= 12;
          const success = Math.random() > 0.5;
          if (success) {
            s.supplies += 20;
            s.hope += 4;
            return { description: "You return with food. Morale rises.", ended: false };
          }
          s.hope -= 6;
          return { description: "Empty-handed. The woods feel hostile.", ended: false };
        },
      },
      {
        label: "Set traps",
        resolve: (s) => {
          s.energy -= 6;
          const win = Math.random() > 0.6;
          if (win) {
            s.supplies += 10;
            s.hope += 2;
            return { description: "Your traps work overnight.", ended: false };
          }
          s.supplies -= 2;
          return { description: "Nothing triggers. You waste time.", ended: false };
        },
      },
    ],
  };
}

function ruinDive() {
  return {
    description: "Ruins ahead: old stores, maybe an electronics shop.",
    choices: [
      {
        label: "Search alone",
        resolve: (s) => {
          s.energy -= 10;
          const lucky = Math.random() > 0.45;
          if (lucky) {
            s.supplies += 12;
            s.hope += 6;
            return { description: "You find medicine and clean water.", ended: false };
          }
          s.hope -= 8;
          return { description: "Only rubble and danger.", ended: false };
        },
      },
      {
        label: "Search quietly and retreat fast",
        resolve: (s) => {
          s.energy -= 5;
          s.supplies += 5;
          return { description: "Small gain, low risk.", ended: false };
        },
      },
    ],
  };
}

function stormApproaching() {
  return {
    description: "A storm rolls in. Travel will be dangerous soon.",
    choices: [
      {
        label: "Travel anyway",
        resolve: (s) => {
          s.energy -= 14;
          const survive = Math.random() > 0.6;
          if (survive) {
            s.supplies += 8;
            s.hope += 3;
            return { description: "You push through and reach shelter.", ended: false };
          }
          s.energy -= 10;
          s.hope -= 12;
          return { description: "You make it, but exhausted and rattled.", ended: false };
        },
      },
      {
        label: "Shelter in place",
        resolve: (s) => {
          s.supplies -= 10;
          s.energy += 6;
          s.hope -= 2;
          return { description: "You conserve energy but burn supplies.", ended: false };
        },
      },
      {
        label: "Repair camp while storm hits",
        resolve: (s) => {
          s.energy -= 7;
          s.supplies -= 8;
          s.hope += 5;
          return { description: "You improve long-term survival odds.", ended: false };
        },
      },
    ],
  };
}

function repairCamp() {
  return {
    description: "Camp is wearing down. Another week like this and it collapses.",
    choices: [
      {
        label: "Reinforce walls",
        resolve: (s) => {
          s.energy -= 8;
          s.supplies -= 10;
          s.hope += 6;
          return { description: "Camp stabilizes. You feel safer.", ended: false };
        },
      },
      {
        label: "Rest instead",
        resolve: (s) => {
          s.energy += 10;
          s.supplies -= 6;
          s.hope -= 1;
          return { description: "You gain energy, but let problems grow.", ended: false };
        },
      },
    ],
  };
}

function radioSignal() {
  return {
    description: "You hear a faint radio broadcast. Coordinates are scrambled.",
    choices: [
      {
        label: "Decode overnight",
        resolve: (s) => {
          s.energy -= 8;
          const decode = Math.random() > 0.55;
          if (decode) {
            s.hope += 15;
            return { description: "You extract a safe-route hint. Hope surges.", ended: false };
          }
          s.hope -= 6;
          return { description: "Static and frustration.", ended: false };
        },
      },
      {
        label: "Ignore and focus on survival",
        resolve: (s) => {
          s.hope -= 2;
          return { description: "Practical, but isolating.", ended: false };
        },
      },
    ],
  };
}

function strangerAtCamp() {
  return {
    description: "A stranger appears at the edge of camp with a neutral stance.",
    choices: [
      {
        label: "Trade supplies",
        resolve: (s) => {
          s.supplies -= 8;
          s.energy += 6;
          s.hope += 4;
          return { description: "Trade works. You gain what you needed most.", ended: false };
        },
      },
      {
        label: "Send them away",
        resolve: (s) => {
          s.hope -= 3;
          return { description: "No conflict, but no gain.", ended: false };
        },
      },
      {
        label: "Invite them in",
        resolve: (s) => {
          const ally = Math.random() > 0.6;
          if (ally) {
            s.hope += 12;
            s.energy += 4;
            return { description: "They help stabilize camp for a while.", ended: false };
          }
          s.supplies -= 12;
          s.hope -= 10;
          return { description: "They take more than they give.", ended: false };
        },
      },
    ],
  };
}

function moraleCrisis() {
  return {
    description: "You feel like giving up. The world feels pointless.",
    choices: [
      {
        label: "Set a small goal",
        resolve: (s) => {
          s.energy -= 4;
          s.hope += 10;
          return { description: "You plan tomorrow, not the whole future.", ended: false };
        },
      },
      {
        label: "Push through blindly",
        resolve: (s) => {
          s.energy -= 10;
          s.hope -= 2;
          return { description: "You keep moving, but it costs you.", ended: false };
        },
      },
    ],
  };
}
