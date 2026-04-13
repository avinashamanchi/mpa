export const PHASE_INSIGHTS = {
  menstrual: [
    { title: 'Rest intentionally', body: 'Prostaglandins peak today. Gentle movement like walking or yoga reduces cramping better than rest alone.' },
    { title: 'Iron awareness', body: 'Blood loss depletes iron. Lean red meat, lentils, or fortified cereals help maintain energy.' },
    { title: 'Heat therapy works', body: 'A heating pad at 40°C is as effective as ibuprofen for mild cramps in clinical studies.' },
  ],
  follicular: [
    { title: 'Your focus is sharpest now', body: 'Rising estradiol improves short-term memory and processing speed. Schedule demanding cognitive work this week.' },
    { title: 'Strength training peaks', body: 'Estrogen supports muscle recovery. Higher training loads and heavier lifts respond better in the follicular phase.' },
    { title: 'Social energy rises', body: 'Estrogen increases serotonin sensitivity. Many people report higher confidence and easier social connection this week.' },
  ],
  ovulatory: [
    { title: 'Fertile window open', body: 'LH surge triggers ovulation 24–36 hours later. Egg-white cervical mucus confirms your most fertile days.' },
    { title: 'Communication peaks', body: 'Estrogen and testosterone together sharpen verbal fluency. Good time for presentations or difficult conversations.' },
    { title: 'Energy is highest', body: 'Most people report peak physical energy around ovulation. Use it for high-intensity exercise or high-stakes tasks.' },
  ],
  luteal: [
    { title: 'Progesterone rises', body: 'Progesterone has a calming, slightly sedating effect. Sleep quality may improve but energy may dip mid-afternoon.' },
    { title: 'Carb cravings are hormonal', body: 'Progesterone raises metabolism ~150 kcal/day. The cravings are real — complex carbs stabilize blood sugar best.' },
    { title: 'Bloating is fluid, not fat', body: 'Progesterone causes water retention. It resolves within 1–2 days of period onset and is not weight gain.' },
  ],
}

export function getInsightForPhase(phase) {
  const insights = PHASE_INSIGHTS[phase] || PHASE_INSIGHTS.follicular
  return insights[Math.floor(Date.now() / 86400000) % insights.length]
}
