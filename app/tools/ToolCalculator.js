'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  calculateDeload,
  calculateExerciseSwaps,
  calculateStrongImportPreview,
  calculateWorkoutCsvValidation,
  calculateRestTime,
  calculateBackoffSets,
  calculateHevyImportPreview,
  calculateNextSet,
  calculateOneRepMax,
  calculatePlateLoad,
  calculateRirTarget,
  calculateStrengthLevel,
  calculateVolume,
  calculateWarmups,
  calculateWorkoutSplit,
} from './calculators.mjs'
import { appStoreUrl } from './toolData.mjs'

function track(event, props) {
  if (typeof window !== 'undefined') {
    window.mixpanel?.track?.(event, props)
  }
}

function analyticsProps(tool, values = {}) {
  const params = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search)
    : new URLSearchParams()

  return {
    tool_name: tool.slug,
    units: values.units || tool.defaults.units || '',
    goal: values.goal || tool.defaults.goal || '',
    exercise_type: values.movementType || values.equipment || tool.defaults.movementType || tool.defaults.equipment || '',
    source_page: typeof document !== 'undefined' ? document.referrer : '',
    utm_source: params.get('utm_source') || '',
    utm_campaign: params.get('utm_campaign') || '',
  }
}

function NumberField({ label, name, value, onChange, min, step = 'any' }) {
  return (
    <label className="tool-field">
      <span>{label}</span>
      <input
        type="number"
        name={name}
        min={min}
        step={step}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
      />
    </label>
  )
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <label className="tool-field">
      <span>{label}</span>
      <select name={name} value={value} onChange={(event) => onChange(name, event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  )
}

function TextField({ label, name, value, onChange, rows = 8 }) {
  return (
    <label className="tool-field tool-field-wide">
      <span>{label}</span>
      <textarea
        name={name}
        rows={rows}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
      />
    </label>
  )
}

function ResultLine({ label, children }) {
  return (
    <div className="tool-result-line">
      <span>{label}</span>
      <strong>{children}</strong>
    </div>
  )
}

function formatLoad(value, units) {
  const num = Number(value)
  if (!Number.isFinite(num)) return `0 ${units}`
  return `${String(num).replace(/\.0$/, '')} ${units}`
}

function useToolState(tool) {
  const [values, setValues] = useState(tool.defaults)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    track('tool_viewed', analyticsProps(tool, tool.defaults))

    const params = new URLSearchParams(window.location.search)
    const next = { ...tool.defaults }
    for (const key of Object.keys(next)) {
      if (params.has(key)) next[key] = params.get(key)
    }
    if (params.has('range')) {
      const [minReps, maxReps] = params.get('range').split('-')
      next.minReps = minReps || next.minReps
      next.maxReps = maxReps || next.maxReps
    }
    setValues(next)
  }, [tool])

  const updateValue = (name, value) => {
    if (!started) {
      setStarted(true)
      track('tool_started', analyticsProps(tool, values))
    }
    setValues((current) => ({ ...current, [name]: value }))
  }

  return [values, updateValue]
}

function resultFor(tool, values) {
  if (tool.type === 'next-set') return calculateNextSet(values)
  if (tool.type === 'rir') return calculateRirTarget(values)
  if (tool.type === 'one-rm') return calculateOneRepMax(values)
  if (tool.type === 'strength-level') return calculateStrengthLevel(values)
  if (tool.type === 'plates') {
    return calculatePlateLoad({
      ...values,
      plates: String(values.plates || '')
        .split(',')
        .map((plate) => Number(plate.trim()))
        .filter((plate) => Number.isFinite(plate) && plate > 0),
    })
  }
  if (tool.type === 'warmup') return calculateWarmups(values)
  if (tool.type === 'volume') return calculateVolume(values)
  if (tool.type === 'deload') return calculateDeload(values)
  if (tool.type === 'split') return calculateWorkoutSplit(values)
  if (tool.type === 'swaps') return calculateExerciseSwaps(values)
  if (tool.type === 'strong-import') return calculateStrongImportPreview(values.csvText)
  if (tool.type === 'csv-validator') return calculateWorkoutCsvValidation(values.csvText)
  if (tool.type === 'rest-time') return calculateRestTime(values)
  if (tool.type === 'backoff') return calculateBackoffSets(values)
  if (tool.type === 'hevy') return calculateHevyImportPreview(values.csvText)
  return calculateWarmups(values)
}

function resultParams(tool, values) {
  const params = new URLSearchParams()
  const allowed = tool.type === 'next-set'
    ? ['weight', 'reps', 'rir', 'units', 'targetRir', 'increment']
    : Object.keys(values)
  for (const key of allowed) {
    if (values[key] !== undefined && values[key] !== '') params.set(key, values[key])
  }
  if (tool.type === 'next-set') params.set('range', `${values.minReps}-${values.maxReps}`)
  return params.toString()
}

export default function ToolCalculator({ tool }) {
  const [values, updateValue] = useToolState(tool)
  const result = useMemo(() => resultFor(tool, values), [tool, values])
  const units = values.units || 'kg'
  const appHref = appStoreUrl(tool.campaign, 'result_cta')

  const complete = () => {
    track('tool_completed', analyticsProps(tool, values))
  }

  const share = async () => {
    const url = `${window.location.origin}/tools/${tool.slug}?${resultParams(tool, values)}`
    await navigator.clipboard?.writeText(url)
    track('tool_result_shared', analyticsProps(tool, values))
  }

  return (
    <div className="tool-workspace">
      <form className="tool-card" onSubmit={(event) => { event.preventDefault(); complete() }}>
        <div className="tool-card-head">
          <h2>Calculator</h2>
          <span>{tool.primaryKeyword}</span>
        </div>

        {tool.type !== 'plates' && tool.type !== 'volume' && tool.type !== 'deload' && tool.type !== 'split' && tool.type !== 'swaps' && tool.type !== 'hevy' && tool.type !== 'strong-import' && tool.type !== 'csv-validator' && tool.type !== 'rest-time' && tool.type !== 'backoff' && (
          <label className="tool-field tool-field-wide">
            <span>Exercise</span>
            <input type="text" name="exercise" value={values.exercise || ''} onChange={(event) => updateValue('exercise', event.target.value)} />
          </label>
        )}

        {tool.type === 'next-set' && (
          <>
            <SelectField label="Units" name="units" value={values.units} onChange={updateValue} options={['kg', 'lb']} />
            <NumberField label="Last set weight" name="weight" value={values.weight} onChange={updateValue} min="0" />
            <NumberField label="Last set reps" name="reps" value={values.reps} onChange={updateValue} min="1" />
            <NumberField label="Last set RIR" name="rir" value={values.rir} onChange={updateValue} min="0" />
            <NumberField label="Target rep min" name="minReps" value={values.minReps} onChange={updateValue} min="1" />
            <NumberField label="Target rep max" name="maxReps" value={values.maxReps} onChange={updateValue} min="1" />
            <NumberField label="Target RIR" name="targetRir" value={values.targetRir} onChange={updateValue} min="0" />
            <SelectField label="Goal" name="goal" value={values.goal} onChange={updateValue} options={['hypertrophy', 'strength', 'strength + size']} />
            <NumberField label="Minimum increment" name="increment" value={values.increment} onChange={updateValue} min="0.01" />
            <SelectField label="Equipment" name="equipment" value={values.equipment} onChange={updateValue} options={['barbell', 'dumbbell', 'machine', 'cable', 'bodyweight']} />
          </>
        )}

        {tool.type === 'rir' && (
          <>
            <SelectField label="Units" name="units" value={values.units} onChange={updateValue} options={['kg', 'lb']} />
            <NumberField label="Weight" name="weight" value={values.weight} onChange={updateValue} min="0" />
            <NumberField label="Reps" name="reps" value={values.reps} onChange={updateValue} min="1" />
            <NumberField label="RIR" name="rir" value={values.rir} onChange={updateValue} min="0" />
            <NumberField label="Target reps" name="targetReps" value={values.targetReps} onChange={updateValue} min="1" />
            <NumberField label="Target RIR" name="targetRir" value={values.targetRir} onChange={updateValue} min="0" />
            <NumberField label="Minimum increment" name="increment" value={values.increment} onChange={updateValue} min="0.01" />
          </>
        )}

        {tool.type === 'one-rm' && (
          <>
            <SelectField label="Units" name="units" value={values.units} onChange={updateValue} options={['kg', 'lb']} />
            <NumberField label="Weight" name="weight" value={values.weight} onChange={updateValue} min="0" />
            <NumberField label="Reps" name="reps" value={values.reps} onChange={updateValue} min="1" />
            <NumberField label="RIR" name="rir" value={values.rir} onChange={updateValue} min="0" />
            <SelectField label="Formula" name="formula" value={values.formula} onChange={updateValue} options={['jacked', 'epley', 'brzycki', 'lander']} />
            <NumberField label="Minimum increment" name="increment" value={values.increment} onChange={updateValue} min="0.01" />
          </>
        )}

        {tool.type === 'strength-level' && (
          <>
            <SelectField label="Units" name="units" value={values.units} onChange={updateValue} options={['kg', 'lb']} />
            <SelectField label="Sex" name="sex" value={values.sex} onChange={updateValue} options={['male', 'female']} />
            <NumberField label="Age" name="age" value={values.age} onChange={updateValue} min="1" />
            <NumberField label="Bodyweight" name="bodyweight" value={values.bodyweight} onChange={updateValue} min="1" />
            <NumberField label="Lift weight" name="liftWeight" value={values.liftWeight} onChange={updateValue} min="0" />
            <NumberField label="Reps" name="reps" value={values.reps} onChange={updateValue} min="1" />
            <NumberField label="RIR" name="rir" value={values.rir} onChange={updateValue} min="0" />
            <NumberField label="Minimum increment" name="increment" value={values.increment} onChange={updateValue} min="0.01" />
          </>
        )}

        {tool.type === 'plates' && (
          <>
            <SelectField label="Units" name="units" value={values.units} onChange={updateValue} options={['kg', 'lb']} />
            <NumberField label="Target total weight" name="targetWeight" value={values.targetWeight} onChange={updateValue} min="0" />
            <NumberField label="Bar weight" name="barWeight" value={values.barWeight} onChange={updateValue} min="0" />
            <NumberField label="Collar weight each" name="collarsEach" value={values.collarsEach} onChange={updateValue} min="0" />
            <SelectField label="Load style" name="loadStyle" value={values.loadStyle} onChange={updateValue} options={['balanced', 'fewest']} />
            <label className="tool-field tool-field-wide">
              <span>Available plates</span>
              <input type="text" name="plates" value={values.plates || ''} onChange={(event) => updateValue('plates', event.target.value)} />
            </label>
          </>
        )}

        {tool.type === 'warmup' && (
          <>
            <SelectField label="Movement type" name="movementType" value={values.movementType} onChange={updateValue} options={['squat', 'hinge', 'horizontal press', 'vertical press', 'row / pull', 'isolation']} />
            <SelectField label="Units" name="units" value={values.units} onChange={updateValue} options={['kg', 'lb']} />
            <NumberField label="Target working weight" name="targetWeight" value={values.targetWeight} onChange={updateValue} min="0" />
            <NumberField label="Target working reps" name="targetReps" value={values.targetReps} onChange={updateValue} min="1" />
            <NumberField label="Minimum increment" name="increment" value={values.increment} onChange={updateValue} min="0.01" />
            <SelectField label="Last heavy exposure" name="lastExposure" value={values.lastExposure} onChange={updateValue} options={['today', '1-3 days', '4-7 days', '8+ days']} />
            <SelectField label="Training status" name="status" value={values.status} onChange={updateValue} options={['fresh', 'normal', 'sore', 'cautious']} />
            <SelectField label="Warm-up preference" name="preference" value={values.preference} onChange={updateValue} options={['minimal', 'standard', 'thorough']} />
          </>
        )}

        {tool.type === 'volume' && (
          <>
            {[
              ['Chest sets', 'chest'],
              ['Back sets', 'back'],
              ['Quads sets', 'quads'],
              ['Hamstrings sets', 'hamstrings'],
              ['Glutes sets', 'glutes'],
              ['Side delts sets', 'sideDelts'],
              ['Rear delts sets', 'rearDelts'],
              ['Biceps sets', 'biceps'],
              ['Triceps sets', 'triceps'],
              ['Calves sets', 'calves'],
              ['Abs sets', 'abs'],
            ].map(([label, name]) => <NumberField key={name} label={label} name={name} value={values[name]} onChange={updateValue} min="0" />)}
            <SelectField label="Training age" name="trainingAge" value={values.trainingAge} onChange={updateValue} options={['beginner', 'intermediate', 'advanced']} />
            <SelectField label="Goal" name="goal" value={values.goal} onChange={updateValue} options={['hypertrophy', 'strength', 'maintenance']} />
            <SelectField label="Recovery" name="recovery" value={values.recovery} onChange={updateValue} options={['good', 'normal', 'poor']} />
            <SelectField label="Performance trend" name="performanceTrend" value={values.performanceTrend} onChange={updateValue} options={['up', 'flat', 'down']} />
            <SelectField label="Soreness" name="soreness" value={values.soreness} onChange={updateValue} options={['low', 'normal', 'high']} />
          </>
        )}

        {tool.type === 'deload' && (
          <>
            <NumberField label="Weeks since last deload" name="weeksSinceDeload" value={values.weeksSinceDeload} onChange={updateValue} min="0" />
            <SelectField label="Recent performance" name="performance" value={values.performance} onChange={updateValue} options={['improving', 'flat', 'down']} />
            <SelectField label="Missed targets" name="missedTargets" value={values.missedTargets} onChange={updateValue} options={['none', '1 workout', '2+ workouts']} />
            <SelectField label="Soreness" name="soreness" value={values.soreness} onChange={updateValue} options={['low', 'normal', 'high']} />
            <SelectField label="Joint discomfort" name="jointDiscomfort" value={values.jointDiscomfort} onChange={updateValue} options={['none', 'mild', 'significant']} />
            <SelectField label="Sleep" name="sleep" value={values.sleep} onChange={updateValue} options={['good', 'normal', 'poor']} />
            <SelectField label="Motivation" name="motivation" value={values.motivation} onChange={updateValue} options={['normal', 'low']} />
            <SelectField label="Work/life stress" name="stress" value={values.stress} onChange={updateValue} options={['low', 'normal', 'high']} />
          </>
        )}

        {tool.type === 'split' && (
          <>
            <SelectField label="Days per week" name="days" value={String(values.days)} onChange={updateValue} options={['2', '3', '4', '5', '6']} />
            <SelectField label="Goal" name="goal" value={values.goal} onChange={updateValue} options={['hypertrophy', 'strength', 'strength + size']} />
            <SelectField label="Session length" name="sessionLength" value={values.sessionLength} onChange={updateValue} options={['30', '45', '60', '75+']} />
            <SelectField label="Equipment" name="equipment" value={values.equipment} onChange={updateValue} options={['commercial gym', 'home gym', 'dumbbells only', 'barbell only']} />
            <SelectField label="Experience" name="experience" value={values.experience} onChange={updateValue} options={['beginner', 'intermediate', 'advanced']} />
            <SelectField label="Muscle focus" name="focus" value={values.focus} onChange={updateValue} options={['chest', 'back', 'quads', 'hamstrings', 'glutes', 'delts', 'arms']} />
          </>
        )}

        {tool.type === 'swaps' && (
          <>
            <SelectField label="Exercise to replace" name="exercise" value={values.exercise} onChange={updateValue} options={['barbell back squat', 'bench press', 'deadlift', 'leg press', 'lat pulldown', 'lateral raise']} />
            <SelectField label="Reason" name="reason" value={values.reason} onChange={updateValue} options={['equipment unavailable', 'joint discomfort', 'too much fatigue', 'bored / preference', 'machine taken']} />
            <SelectField label="Equipment available" name="equipment" value={values.equipment} onChange={updateValue} options={['commercial gym', 'home gym', 'dumbbells only', 'barbell only']} />
            <SelectField label="Goal" name="goal" value={values.goal} onChange={updateValue} options={['same muscle', 'less fatigue', 'similar movement', 'home gym alternative']} />
          </>
        )}

        {tool.type === 'hevy' && (
          <>
            <label className="tool-field tool-field-wide">
              <span>Upload Hevy CSV</span>
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={async (event) => {
                  const file = event.target.files?.[0]
                  if (file) updateValue('csvText', await file.text())
                }}
              />
            </label>
            <TextField label="Or paste CSV preview" name="csvText" value={values.csvText || ''} onChange={updateValue} rows={10} />
          </>
        )}

        {(tool.type === 'strong-import' || tool.type === 'csv-validator') && (
          <>
            <label className="tool-field tool-field-wide">
              <span>Upload workout CSV</span>
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={async (event) => {
                  const file = event.target.files?.[0]
                  if (file) updateValue('csvText', await file.text())
                }}
              />
            </label>
            <TextField label="Or paste CSV preview" name="csvText" value={values.csvText || ''} onChange={updateValue} rows={10} />
          </>
        )}

        {tool.type === 'rest-time' && (
          <>
            <SelectField label="Movement type" name="movementType" value={values.movementType} onChange={updateValue} options={['squat', 'hinge', 'horizontal press', 'vertical press', 'row / pull', 'isolation']} />
            <SelectField label="Goal" name="goal" value={values.goal} onChange={updateValue} options={['hypertrophy', 'strength', 'strength + size', 'endurance']} />
            <NumberField label="Last set reps" name="reps" value={values.reps} onChange={updateValue} min="1" />
            <NumberField label="Last set RIR" name="rir" value={values.rir} onChange={updateValue} min="0" />
            <SelectField label="Last set difficulty" name="lastSetDifficulty" value={values.lastSetDifficulty} onChange={updateValue} options={['easy', 'normal', 'grindy']} />
            <SelectField label="Next set priority" name="nextSetPriority" value={values.nextSetPriority} onChange={updateValue} options={['same reps', 'load', 'pump']} />
            <SelectField label="Time pressure" name="timePressure" value={values.timePressure} onChange={updateValue} options={['short', 'normal', 'plenty']} />
          </>
        )}

        {tool.type === 'backoff' && (
          <>
            <SelectField label="Units" name="units" value={values.units} onChange={updateValue} options={['kg', 'lb']} />
            <NumberField label="Top set weight" name="topSetWeight" value={values.topSetWeight} onChange={updateValue} min="0" />
            <NumberField label="Top set reps" name="topSetReps" value={values.topSetReps} onChange={updateValue} min="1" />
            <NumberField label="Top set RIR" name="topSetRir" value={values.topSetRir} onChange={updateValue} min="0" />
            <SelectField label="Goal" name="goal" value={values.goal} onChange={updateValue} options={['hypertrophy', 'strength', 'strength + size']} />
            <NumberField label="Backoff sets" name="backoffSets" value={values.backoffSets} onChange={updateValue} min="1" />
            <NumberField label="Backoff reps" name="backoffReps" value={values.backoffReps} onChange={updateValue} min="1" />
            <SelectField label="Fatigue" name="fatigue" value={values.fatigue} onChange={updateValue} options={['low', 'normal', 'high']} />
            <SelectField label="Readiness" name="readiness" value={values.readiness} onChange={updateValue} options={['poor', 'normal', 'good']} />
            <NumberField label="Minimum increment" name="increment" value={values.increment} onChange={updateValue} min="0.01" />
          </>
        )}

        <button className="tool-primary" type="submit">Calculate</button>
      </form>

      <aside className="tool-result-card">
        <span className="tool-kicker">Result</span>
        {tool.type === 'next-set' && (
          <>
            <h2>{formatLoad(result.targetWeight, units)} x {result.targetRepText} @ {result.targetRir} RIR</h2>
            <p><strong>Why:</strong> {result.reason}</p>
            <ResultLine label="Conservative option">{formatLoad(result.conservative.weight, units)} x {result.conservative.repText} @ {result.conservative.targetRir} RIR</ResultLine>
            <ResultLine label="Confidence">{result.confidence.label}</ResultLine>
            <p className="tool-muted">{result.confidence.text}</p>
          </>
        )}

        {tool.type === 'rir' && (
          <>
            <h2>{formatLoad(result.targetWeight, units)} x {result.targetReps} @ {result.targetRir} RIR</h2>
            <p><strong>Why:</strong> Estimated 1RM is {formatLoad(result.estimated1RM, units)}. RIR {result.targetRir} equals RPE {result.rpe}.</p>
            <div className="rir-table">
              <table>
                <thead><tr><th>Reps</th>{[0, 1, 2, 3, 4, 5].map((rir) => <th key={rir}>RIR {rir}</th>)}</tr></thead>
                <tbody>
                  {result.table.slice(0, 12).map((row) => (
                    <tr key={row.reps}>
                      <th>{row.reps}</th>
                      {row.loads.map((cell) => <td key={cell.rir}>{cell.weight}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tool.type === 'one-rm' && (
          <>
            <h2>{formatLoad(result.estimated1RM, units)} estimated 1RM</h2>
            <p><strong>Useful next target:</strong> {formatLoad(result.usefulTarget.weight, units)} x {result.usefulTarget.reps} @ {result.usefulTarget.rir} RIR.</p>
            <div className="mini-grid">
              {result.repMaxes.map((item) => <ResultLine key={item.reps} label={`${item.reps}RM`}>{formatLoad(item.weight, units)}</ResultLine>)}
            </div>
            <div className="mini-grid">
              {result.percentages.map((item) => <ResultLine key={item.percent} label={`${item.percent}%`}>{formatLoad(item.weight, units)}</ResultLine>)}
            </div>
          </>
        )}

        {tool.type === 'strength-level' && (
          <>
            <h2>{result.level}</h2>
            <p><strong>Why:</strong> {result.why}</p>
            <ResultLine label="Estimated 1RM">{formatLoad(result.estimated1RM, units)}</ResultLine>
            <ResultLine label="Bodyweight ratio">{result.bodyweightRatio}x</ResultLine>
            <ResultLine label="Next level">{result.nextLevel}</ResultLine>
            <ResultLine label="Gap">{formatLoad(result.gapToNextLevel, units)}</ResultLine>
            <p><strong>Next action:</strong> {result.nextAction}</p>
            <div className="standards-list">
              {result.standards.map((standard) => (
                <div key={standard.level} className={standard.level === result.level ? 'is-current' : ''}>
                  <strong>{standard.level}</strong>
                  <span>{formatLoad(standard.target, units)}</span>
                  <em>{standard.ratio}x BW</em>
                </div>
              ))}
            </div>
            <ResultLine label="Confidence">{result.confidence.label}</ResultLine>
            <p className="tool-muted">{result.caveat}</p>
          </>
        )}

        {tool.type === 'plates' && (
          <>
            <h2>{result.eachSide.length ? result.eachSide.map((plate) => `${plate}`).join(' + ') : 'Bar only'} per side</h2>
            <p><strong>Total:</strong> {formatLoad(result.actualWeight, units)} including a {formatLoad(result.barWeight, units)} bar.</p>
            <ResultLine label="Collars">{formatLoad(result.collarsTotal, units)} total</ResultLine>
            <ResultLine label="Difference from target">{formatLoad(result.remaining, units)}</ResultLine>
            <p className="tool-muted">Nearest loads: {result.nearest.map((item) => formatLoad(item, units)).join(' or ')}</p>
          </>
        )}

        {tool.type === 'warmup' && (
          <>
            <h2>{result.sets.length} warm-up sets</h2>
            <div className="warmup-list">
              {result.sets.map((set) => (
                <div key={`${set.weight}-${set.reps}`}><strong>{formatLoad(set.weight, units)} x {set.reps}</strong><span>{set.percent}%</span></div>
              ))}
            </div>
            <p><strong>Then:</strong> {formatLoad(result.working.weight, units)} x {result.working.reps} working sets.</p>
            <p><strong>Why:</strong> {result.reason}</p>
          </>
        )}

        {tool.type === 'volume' && (
          <>
            <h2>{result.summary}</h2>
            <p><strong>Next action:</strong> {result.nextAction}</p>
            <div className="volume-list">
              {result.muscles.map((muscle) => (
                <div key={muscle.key}>
                  <strong>{muscle.label}</strong>
                  <span>{muscle.sets} sets</span>
                  <em>{muscle.status}</em>
                </div>
              ))}
            </div>
            <p className="tool-muted">{result.caveat}</p>
          </>
        )}

        {tool.type === 'deload' && (
          <>
            <h2>{result.recommendation}</h2>
            <p><strong>Why:</strong> {result.why}</p>
            <p><strong>Suggested change:</strong> {result.suggestedChange}</p>
            <ResultLine label="Fatigue score">{result.score}</ResultLine>
            <p className="tool-muted">{result.safety}</p>
          </>
        )}

        {tool.type === 'split' && (
          <>
            <h2>{result.name}</h2>
            <p><strong>Why:</strong> {result.why}</p>
            <div className="split-day-list">
              {result.week.map((day) => (
                <section key={day.name} className="split-day-card">
                  <header>
                    <div>
                      <strong>{day.name}</strong>
                      <span>{day.focus}</span>
                    </div>
                    <em>{day.estimatedMinutes} min</em>
                  </header>
                  <div className="split-exercise-list">
                    {day.exercises.map((exercise) => (
                      <div key={`${day.name}-${exercise.name}`} className="split-exercise-row">
                        <strong>{exercise.name}</strong>
                        <span>{exercise.sets} x {exercise.reps}</span>
                        <em>{exercise.rest}</em>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
            <div className="split-volume-grid">
              {result.weeklyVolume.slice(0, 8).map((item) => (
                <div key={item.muscle}>
                  <strong>{item.muscle}</strong>
                  <span>{item.sets} sets</span>
                  <em>{item.frequency}x/week</em>
                </div>
              ))}
            </div>
            <div className="split-rules">
              {result.progression.map((rule) => (
                <p key={rule}>{rule}</p>
              ))}
            </div>
            <p className="tool-muted">{result.constraints}</p>
          </>
        )}

        {tool.type === 'swaps' && (
          <>
            <h2>{result.options[0]?.name || 'Pick a close variation'}</h2>
            <p><strong>Next action:</strong> {result.nextAction}</p>
            <div className="swap-list">
              {result.options.map((option, index) => (
                <div key={option.name}>
                  <strong>{index + 1}. {option.name}</strong>
                  <span>{option.reason}</span>
                </div>
              ))}
            </div>
            <p className="tool-muted">{result.caveat}</p>
          </>
        )}

        {tool.type === 'hevy' && (
          <>
            <h2>{result.ready ? 'Ready for Jacked' : 'Paste or upload a CSV'}</h2>
            <div className="mini-grid">
              <ResultLine label="Workouts">{result.workouts}</ResultLine>
              <ResultLine label="Sets">{result.sets}</ResultLine>
              <ResultLine label="Exercises">{result.exercises}</ResultLine>
              <ResultLine label="Measurements">{result.measurements}</ResultLine>
            </div>
            <ResultLine label="Likely match confidence">{result.matchConfidence}%</ResultLine>
            <p><strong>Why:</strong> This preview found dated set rows and exercise names that Jacked can use to make imported history useful.</p>
            <p className="tool-muted">{result.privacy}</p>
          </>
        )}

        {tool.type === 'strong-import' && (
          <>
            <h2>{result.ready ? 'Ready to preview in Jacked' : result.status}</h2>
            <div className="mini-grid">
              <ResultLine label="Workouts">{result.workouts}</ResultLine>
              <ResultLine label="Sets">{result.sets}</ResultLine>
              <ResultLine label="Exercises">{result.exercises}</ResultLine>
              <ResultLine label="Rows">{result.rows}</ResultLine>
            </div>
            <ResultLine label="Likely match confidence">{result.matchConfidence}%</ResultLine>
            <p><strong>Next action:</strong> {result.nextAction}</p>
            {result.issues.length > 0 && (
              <div className="swap-list">
                {result.issues.slice(0, 5).map((issue) => (
                  <div key={`${issue.field}-${issue.message}`}>
                    <strong>{issue.field}</strong>
                    <span>{issue.message}</span>
                  </div>
                ))}
              </div>
            )}
            <p className="tool-muted">{result.privacy}</p>
          </>
        )}

        {tool.type === 'csv-validator' && (
          <>
            <h2>{result.status}</h2>
            <div className="mini-grid">
              <ResultLine label="Rows">{result.rows}</ResultLine>
              <ResultLine label="Workouts">{result.workouts}</ResultLine>
              <ResultLine label="Sets">{result.sets}</ResultLine>
              <ResultLine label="Exercises">{result.exercises}</ResultLine>
            </div>
            <p><strong>Next action:</strong> {result.nextAction}</p>
            <div className="swap-list">
              {(result.issues.length ? result.issues : [{ field: 'shape', message: 'No blockers found in the common workout CSV fields.' }]).slice(0, 6).map((issue) => (
                <div key={`${issue.field}-${issue.message}`}>
                  <strong>{issue.field}</strong>
                  <span>{issue.message}</span>
                </div>
              ))}
            </div>
            <p className="tool-muted">{result.privacy}</p>
          </>
        )}

        {tool.type === 'rest-time' && (
          <>
            <h2>{result.label}</h2>
            <p><strong>Why:</strong> {result.reason}</p>
            <p><strong>Next action:</strong> {result.nextAction}</p>
            <ResultLine label="Timer seconds">{result.seconds}</ResultLine>
            <p className="tool-muted">{result.caveat}</p>
          </>
        )}

        {tool.type === 'backoff' && (
          <>
            <h2>{result.sets[0]?.weight || 0} {units} backoffs</h2>
            <p><strong>Why:</strong> {result.reason}</p>
            <p><strong>Next action:</strong> {result.nextAction}</p>
            <div className="warmup-list">
              {result.sets.map((set) => (
                <div key={set.set}><strong>Set {set.set}: {formatLoad(set.weight, units)} x {set.reps}</strong><span>{set.targetRir} RIR</span></div>
              ))}
            </div>
            <ResultLine label="Drop">{result.dropPercent}%</ResultLine>
            <ResultLine label="Confidence">{result.confidence.label}</ResultLine>
          </>
        )}

        <p className="tool-app-copy">Jacked does this automatically while you train.</p>
        <div className="tool-result-actions">
          <a
            className="tool-primary"
            href={appHref}
            target="_blank"
            rel="noopener noreferrer"
            data-tool-app-store={tool.slug}
            onClick={() => track('tool_app_store_clicked', analyticsProps(tool, values))}
          >
            Download Jacked for iPhone
          </a>
          <button className="tool-secondary" type="button" onClick={share}>Share result</button>
        </div>
      </aside>
    </div>
  )
}
