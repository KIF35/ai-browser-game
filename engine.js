export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function randomChoice(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export function formatStats(state) {
  return [
    { key: "Day", value: state.day },
    { key: "Energy", value: state.energy },
    { key: "Supplies", value: state.supplies },
    { key: "Hope", value: state.hope },
  ];
}

export function summarize(state, event, outcome) {
  const tone =
    state.hope >= 70
      ? randomChoice([
          "You feel momentum.",
          "Hope is alive.",
          "Progress seems possible.",
        ])
      : state.hope >= 40
      ? randomChoice([
          "Uncertainty hangs in the air.",
          "You’re holding it together.",
          "The path is unclear.",
        ])
      : randomChoice([
          "Things look grim.",
          "You’re running on fumes.",
          "Your luck is thin.",
        ]);

  return [
    `Day ${state.day}: ${event.description}`,
    outcome.description,
    tone,
  ].join(" ");
}
