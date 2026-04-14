import { useState } from 'react'
import { differenceInDays, parseISO } from 'date-fns'
import { useProfile } from '../hooks/useProfile.js'
import { addCycle } from '../storage/db.js'

const CONTRACEPTIVES = ['None', 'Pill', 'Hormonal IUD', 'Copper IUD', 'Implant', 'Patch', 'Other']
const CONDITIONS = ['PCOS', 'Endometriosis', 'Thyroid disorder', 'Perimenopause']
const TOTAL_STEPS = 7

function ProgressBar({ step }) {
  return (
    <div className="w-full h-1 bg-border-default rounded-full mb-8">
      <div
        className="h-1 rounded-full transition-all duration-500"
        style={{
          width: `${((step + 1) / TOTAL_STEPS) * 100}%`,
          background: 'linear-gradient(to right, #E8748A, #D4881A)',
        }}
      />
    </div>
  )
}

function StepWrapper({ children }) {
  return (
    <div className="flex flex-col max-w-md mx-auto w-full px-6">
      {children}
    </div>
  )
}

function OptionButton({ selected, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-lg border text-sm font-light transition-all ${
        selected
          ? 'border-primary bg-primary/8 text-primary'
          : 'border-border-default text-body hover:border-primary/40 hover:bg-primary/5'
      }`}
    >
      {children}
    </button>
  )
}

export function OnboardingWizard({ onComplete }) {
  const { updateProfile } = useProfile()
  const [step, setStep] = useState(0)
  const [data, setData] = useState({
    name: '',
    goal: '',
    lastPeriodDate: '',
    period2Date: '',
    period3Date: '',
    periodDuration: 5,
    cycleLength: 28,
    cycleRegularity: '',
    birthYear: '',
    heightCm: '',
    weightKg: '',
    contraceptiveType: 'None',
    conditions: [],
    stressLevel: '',
    activityLevel: '',
  })

  const set = (key, value) => setData(prev => ({ ...prev, [key]: value }))
  const toggleCondition = (cond) => setData(prev => ({
    ...prev,
    conditions: prev.conditions.includes(cond)
      ? prev.conditions.filter(c => c !== cond)
      : [...prev.conditions, cond],
  }))

  async function handleFinish() {
    await updateProfile({ ...data, onboardingComplete: true })
    const dates = [data.period3Date, data.period2Date, data.lastPeriodDate]
      .filter(Boolean)
      .sort()
    for (let i = 0; i < dates.length; i++) {
      const nextDate = dates[i + 1]
      const length = nextDate
        ? differenceInDays(parseISO(nextDate), parseISO(dates[i]))
        : null
      await addCycle({ startDate: dates[i], endDate: null, length, flow: 'Medium' })
    }
    onComplete()
  }

  const steps = [
    // Step 0: Welcome
    <StepWrapper key="welcome">
      <p className="text-xs text-body uppercase tracking-widest mb-3">Welcome</p>
      <h1 className="text-4xl font-light text-heading mb-2" style={{ letterSpacing: '-0.04em' }}>
        Hey there 🌸
      </h1>
      <p className="text-body font-light mb-8 text-sm leading-relaxed">
        I'm MPA — your private period assistant. Let's set things up so I can give you the most accurate predictions possible.
      </p>
      <label className="block text-xs text-label mb-1 font-light">Your name (optional)</label>
      <input
        type="text"
        value={data.name}
        onChange={e => set('name', e.target.value)}
        placeholder="e.g. Ava"
        className="w-full border border-border-default rounded-lg px-4 py-3 text-sm font-light focus:outline-none focus:border-primary mb-6"
      />
      <label className="block text-xs text-label mb-2 font-light">What's your goal?</label>
      <div className="space-y-2">
        {['Track my period', 'Plan a pregnancy', 'General health awareness'].map(g => (
          <OptionButton key={g} selected={data.goal === g} onClick={() => set('goal', g)}>{g}</OptionButton>
        ))}
      </div>
    </StepWrapper>,

    // Step 1: Last period(s)
    <StepWrapper key="lastperiod">
      <p className="text-xs text-body uppercase tracking-widest mb-3">Step 1 of 6</p>
      <h2 className="text-3xl font-light text-heading mb-2" style={{ letterSpacing: '-0.04em' }}>
        When did your recent periods start?
      </h2>
      <p className="text-body font-light text-sm mb-8 leading-relaxed">
        Adding more dates gives me a head start on your pattern — predictions improve immediately.
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-label mb-1 font-light">Most recent period <span className="text-primary">*</span></label>
          <input
            type="date"
            value={data.lastPeriodDate}
            onChange={e => set('lastPeriodDate', e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full border border-border-default rounded-lg px-4 py-3 text-sm font-light focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-xs text-label mb-1 font-light">Period before that <span className="text-body/50">(optional)</span></label>
          <input
            type="date"
            value={data.period2Date}
            onChange={e => set('period2Date', e.target.value)}
            max={data.lastPeriodDate || new Date().toISOString().split('T')[0]}
            className="w-full border border-border-default rounded-lg px-4 py-3 text-sm font-light focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-xs text-label mb-1 font-light">One more before that <span className="text-body/50">(optional)</span></label>
          <input
            type="date"
            value={data.period3Date}
            onChange={e => set('period3Date', e.target.value)}
            max={data.period2Date || data.lastPeriodDate || new Date().toISOString().split('T')[0]}
            className="w-full border border-border-default rounded-lg px-4 py-3 text-sm font-light focus:outline-none focus:border-primary"
          />
        </div>
      </div>
      <p className="text-xs text-body/50 font-light mt-4">Only the first date is required</p>
    </StepWrapper>,

    // Step 2: Cycle history
    <StepWrapper key="cycle">
      <p className="text-xs text-body uppercase tracking-widest mb-3">Step 2 of 6</p>
      <h2 className="text-3xl font-light text-heading mb-2" style={{ letterSpacing: '-0.04em' }}>
        Tell me about your cycle
      </h2>
      <p className="text-body font-light text-sm mb-8 leading-relaxed">The average cycle is 28 days, but everyone's different.</p>
      <label className="block text-xs text-label mb-1 font-light">
        Typical cycle length: <span className="text-primary font-normal">{data.cycleLength} days</span>
      </label>
      <input
        type="range"
        min={21} max={45} value={data.cycleLength}
        onChange={e => set('cycleLength', +e.target.value)}
        className="w-full mb-6"
        style={{ accentColor: '#E8748A' }}
      />
      <label className="block text-xs text-label mb-2 font-light">How regular is your cycle?</label>
      <div className="space-y-2">
        {[
          { value: 'regular', label: 'Very regular — same length each month' },
          { value: 'somewhat', label: 'Somewhat regular — varies a few days' },
          { value: 'irregular', label: 'Irregular — hard to predict' },
          { value: 'unsure', label: "Not sure" },
        ].map(opt => (
          <OptionButton key={opt.value} selected={data.cycleRegularity === opt.value} onClick={() => set('cycleRegularity', opt.value)}>
            {opt.label}
          </OptionButton>
        ))}
      </div>
    </StepWrapper>,

    // Step 3: Health profile
    <StepWrapper key="health">
      <p className="text-xs text-body uppercase tracking-widest mb-3">Step 3 of 6</p>
      <h2 className="text-3xl font-light text-heading mb-2" style={{ letterSpacing: '-0.04em' }}>
        Health profile
      </h2>
      <p className="text-body font-light text-sm mb-8 leading-relaxed">Used to personalise your predictions. All data stays on this device.</p>
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-label mb-1 font-light">Year of birth</label>
          <input
            type="number" value={data.birthYear} onChange={e => set('birthYear', +e.target.value)}
            min={1940} max={2012} placeholder="1995"
            className="w-full border border-border-default rounded-lg px-4 py-3 text-sm font-light focus:outline-none focus:border-primary"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-label mb-1 font-light">Height (cm)</label>
            <input
              type="number" value={data.heightCm} onChange={e => set('heightCm', +e.target.value)}
              placeholder="165"
              className="w-full border border-border-default rounded-lg px-4 py-3 text-sm font-light focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs text-label mb-1 font-light">Weight (kg)</label>
            <input
              type="number" value={data.weightKg} onChange={e => set('weightKg', +e.target.value)}
              placeholder="60"
              className="w-full border border-border-default rounded-lg px-4 py-3 text-sm font-light focus:outline-none focus:border-primary"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs text-label mb-1 font-light">Contraceptive</label>
          <select
            value={data.contraceptiveType} onChange={e => set('contraceptiveType', e.target.value)}
            className="w-full border border-border-default rounded-lg px-4 py-3 text-sm font-light focus:outline-none focus:border-primary bg-white"
          >
            {CONTRACEPTIVES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
    </StepWrapper>,

    // Step 4: Conditions
    <StepWrapper key="conditions">
      <p className="text-xs text-body uppercase tracking-widest mb-3">Step 4 of 6</p>
      <h2 className="text-3xl font-light text-heading mb-2" style={{ letterSpacing: '-0.04em' }}>
        Any relevant conditions?
      </h2>
      <p className="text-body font-light text-sm mb-8 leading-relaxed">These help me account for cycle variability in predictions. Select all that apply.</p>
      <div className="space-y-2 mb-3">
        {CONDITIONS.map(cond => (
          <OptionButton
            key={cond}
            selected={data.conditions.includes(cond)}
            onClick={() => toggleCondition(cond)}
          >
            {cond}
          </OptionButton>
        ))}
      </div>
      <OptionButton selected={data.conditions.length === 0} onClick={() => set('conditions', [])}>
        None of the above
      </OptionButton>
    </StepWrapper>,

    // Step 5: Lifestyle
    <StepWrapper key="lifestyle">
      <p className="text-xs text-body uppercase tracking-widest mb-3">Step 5 of 6</p>
      <h2 className="text-3xl font-light text-heading mb-2" style={{ letterSpacing: '-0.04em' }}>
        Your lifestyle
      </h2>
      <p className="text-body font-light text-sm mb-8 leading-relaxed">Stress and activity influence your cycle more than most people realise.</p>
      <label className="block text-xs text-label mb-2 font-light">Typical stress level</label>
      <div className="space-y-2 mb-6">
        {[
          { value: 'low', label: 'Low — generally relaxed' },
          { value: 'medium', label: 'Medium — some stress, manageable' },
          { value: 'high', label: 'High — often stressed or anxious' },
        ].map(opt => (
          <OptionButton key={opt.value} selected={data.stressLevel === opt.value} onClick={() => set('stressLevel', opt.value)}>
            {opt.label}
          </OptionButton>
        ))}
      </div>
      <label className="block text-xs text-label mb-2 font-light">Activity level</label>
      <div className="space-y-2">
        {[
          { value: 'sedentary', label: 'Sedentary — mostly sitting' },
          { value: 'moderate', label: 'Moderate — some exercise weekly' },
          { value: 'active', label: 'Active — exercise most days' },
        ].map(opt => (
          <OptionButton key={opt.value} selected={data.activityLevel === opt.value} onClick={() => set('activityLevel', opt.value)}>
            {opt.label}
          </OptionButton>
        ))}
      </div>
    </StepWrapper>,

    // Step 6: Done
    <StepWrapper key="done">
      <div className="text-center py-8">
        <div className="text-6xl mb-6">🌸</div>
        <h2 className="text-4xl font-light text-heading mb-3" style={{ letterSpacing: '-0.04em' }}>
          {data.name ? `You're all set, ${data.name}!` : "You're all set!"}
        </h2>
        <p className="text-body font-light mb-8 text-sm leading-relaxed">
          Your predictions will improve as you log more cycles. The more you track, the more accurate I become.
        </p>
        <div className="p-4 rounded-xl bg-primary/5 border border-border-default text-left">
          <p className="text-xs text-body font-light">🔒 All your data stays on this device only. No accounts. No tracking. No servers.</p>
        </div>
      </div>
    </StepWrapper>,
  ]

  const isLastStep = step === TOTAL_STEPS - 1
  const canNext = step === 1
    ? !!data.lastPeriodDate
    : step === 2
    ? !!data.cycleRegularity
    : step === 5
    ? !!data.stressLevel && !!data.activityLevel
    : true

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #fff0f3 0%, #ffffff 50%, #fff8ec 100%)' }}>
      <div className="flex-1 flex flex-col justify-center py-12 overflow-y-auto">
        <div className="max-w-md mx-auto w-full px-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-light text-body tracking-tight">MPA</span>
            {step > 0 && !isLastStep && (
              <span className="text-xs text-body font-light">{step} / {TOTAL_STEPS - 1}</span>
            )}
          </div>
          <ProgressBar step={step} />
        </div>

        {steps[step]}
      </div>

      <div className="max-w-md mx-auto w-full px-6 pb-10 flex gap-3 flex-shrink-0">
        {step > 0 && !isLastStep && (
          <button
            onClick={() => setStep(s => s - 1)}
            className="flex-1 py-3 rounded-xl border border-border-default text-sm font-light text-body hover:bg-border-default/30 transition-colors"
          >
            Back
          </button>
        )}
        <button
          onClick={isLastStep ? handleFinish : () => setStep(s => s + 1)}
          disabled={!canNext}
          className={`flex-1 py-3 rounded-xl text-sm font-light transition-all ${
            canNext
              ? 'text-white shadow-stripe-sm hover:shadow-stripe'
              : 'bg-border-default text-body cursor-not-allowed'
          }`}
          style={canNext ? { background: 'linear-gradient(to right, #E8748A, #D4881A)' } : {}}
        >
          {isLastStep ? "Let's go →" : step === 0 ? 'Get started' : 'Continue'}
        </button>
      </div>
    </div>
  )
}
