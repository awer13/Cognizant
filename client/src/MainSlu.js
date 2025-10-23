import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { Input, Row, Col, Button, Alert } from 'antd'

import SluInverseAdjTaskCombined from './SluInverseAdjTaskCombined'
import SluMatrixMethodTaskCombined from './SluMatrixMethodTaskCombined'
import SluCramerTaskCombined from './SluCramerTaskCombined'

import katex from 'katex'
import 'katex/dist/katex.min.css'

// Firebase
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

// распределение максимумов по заданиям: [1,2,3] = 8/8/9 (итого 25)
const TASK_MAXES = [6, 7, 7]
const MAX_RETRIES = 2 // сколько авто-повторов при ошибке

const StyledButton = styled.button`
  width: 120px;
  margin: 16px 0 8px 0;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 50px;
  font-size: 15px;
`

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,.06);
  padding: 16px;
  margin: 12px 0;
`

function LatexCell({ latex, className }) {
  if (!latex) return null
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(latex, { throwOnError: false })
      }}
    />
  )
}

function toLatexLabel(raw) {
    if (!raw) return ''
    let s = String(raw).trim()
    if (s.includes('\\')) {
      s = s.replace(/\\text\{([^}]*)A\^\{[-−]1\}([^}]*)\}/u, (_, pre='', post='') => `${pre || post ? `\\text{${pre}${post}}` : ''} ${pre||post ? '' : ''}A^{-1}`.trim())
      s = s.replace(/\\text\{([^}]*)A\s*[·\*]\s*A\^\{[-−]1\}([^}]*)\}/u, (_, pre='', post='') => `${pre||post ? `\\text{${pre}${post}}` : ''} A\\,A^{-1}`.trim())
      s = s.replace(/\\text\{([^}]*)A\^\{[-−]1\}\s*[·\*]\s*A([^}]*)\}/u, (_, pre='', post='') => `${pre||post ? `\\text{${pre}${post}}` : ''} A^{-1}\\,A`.trim())
      return s
    }
    const MINUS = '[-−]'
    if (/Матрица/i.test(s) && new RegExp(`A\\^\\{${MINUS}1\\}`).test(s)) return '\\text{Матрица }A^{-1}'
    if (new RegExp(`Произведение\\s*A\\s*[·\\*]\\s*A\^\\{${MINUS}1\\}`, 'u').test(s)) return '\\text{Произведение }A\\,A^{-1}'
    if (new RegExp(`Произведение\\s*A\\^\\{${MINUS}1\\}\\s*[·\\*]\\s*A`, 'u').test(s)) return '\\text{Произведение }A^{-1}\\,A'
    const mAdj = s.match(/Алгебраическ(?:ое|ое )?дополнени[еия]\s*A[_\s{]*(\d)\D*(\d)/i)
    if (mAdj) return `\\text{Алгебраическое дополнение }A_{${mAdj[1]}${mAdj[2]}}`
    if (/det\(A\)/i.test(s)) return '\\text{Определитель }\\det(A)'
    if (/^Delta_?1$/i.test(s) || /^Δ1$/i.test(s)) return '\\Delta_1'
    if (/^Delta_?2$/i.test(s) || /^Δ2$/i.test(s)) return '\\Delta_2'
    if (/^Delta_?3$/i.test(s) || /^Δ3$/i.test(s)) return '\\Delta_3'
    if (/^\(AX\)_1$/i.test(s)) return '(AX)_1'
    if (/^\(AX\)_2$/i.test(s)) return '(AX)_2'
    if (/^\(AX\)_3$/i.test(s)) return '(AX)_3'
    if (/^Решение x_?1$/i.test(s)) return '\\text{Решение }x_1'
    if (/^Решение x_?2$/i.test(s)) return '\\text{Решение }x_2'
    if (/^Решение x_?3$/i.test(s)) return '\\text{Решение }x_3'
    if (/^Решение x$/i.test(s)) return '\\text{Решение }x'
    if (/AX.*подстановка/i.test(s)) return 'AX\\;\\text{(подстановка)}'
    if (/^Строка adj\(A\)/i.test(s)) return '\\text{Строка }\\operatorname{adj}(A)'
    if (/^Столбец adj\(A\)/i.test(s)) return '\\text{Столбец }\\operatorname{adj}(A)'
    const esc = s.replace(/([\\{}_#%])/g,'\\$1')
    return `\\text{${esc}}`
}

const TASK_TITLES = [
  'Задание 1: Вычислите обратную матрицу через присоединённую матрицу',
  'Задание 2: Решить СЛАУ матричным методом',
  'Задание 3: Решить СЛАУ методом Крамера'
]

export default function MainSlu() {
  const [taskNumber, setTaskNumber] = useState()
  const [lastName, setLName] = useState('')
  const [firstName, setFName] = useState('')
  const [groupName, setGName] = useState('')
  const [disabled, setDisabled] = useState(false)
  const [activeTaskIndex, setActiveTaskIndex] = useState(0)
  const [doneForTask, setDoneForTask] = useState(false)
  const [results, setResults] = useState([])
  const [showReport, setShowReport] = useState(false)
  const [saveStatus, setSaveStatus] = useState('idle')
  const [savedDocId, setSavedDocId] = useState(null)
  const [saveError, setSaveError] = useState('')
  const [retryCnt, setRetryCnt] = useState(0)

  const totalMax = useMemo(() => TASK_MAXES.reduce((a,b)=>a+b,0), [])
  const perTaskPoints = useMemo(() => results.map((r, idx) => r ? Math.round((r.scorePercent / 100) * TASK_MAXES[idx]) : 0), [results])
  const perTaskPercents = useMemo(() => results.map((r) => r ? Math.round(r.scorePercent) : 0), [results])
  const totalPoints = useMemo(() => perTaskPoints.reduce((s,x)=>s+x,0), [perTaskPoints])
  const totalPercent = useMemo(() => Math.round((totalPoints / totalMax) * 100), [totalPoints, totalMax])

  const handleSubmitID = (e) => {
    e.preventDefault()
    if (!firstName || !lastName || !groupName || !taskNumber) return
    setDisabled(true)
    setActiveTaskIndex(0)
    setResults([])
    setDoneForTask(false)
    setShowReport(false)
    setSaveStatus('idle')
    setSavedDocId(null)
    setSaveError('')
    setRetryCnt(0)
  }

  const onTaskDone = (payload) => {
    setResults(prev => {
      const cp = [...prev]
      cp[activeTaskIndex] = payload
      return cp
    })
    setDoneForTask(true)
  }

  const goNextTask = () => {
    if (activeTaskIndex < 2) {
      setActiveTaskIndex(i => i + 1)
      setDoneForTask(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setShowReport(true)
    }
  }

  useEffect(() => {
    setShowReport(false)
    setResults([])
    setDoneForTask(false)
    setActiveTaskIndex(0)
    setSaveStatus('idle');
    setSavedDocId(null);
    setSaveError('');
    setRetryCnt(0);
  }, [taskNumber])

  const renderCurrentTask = () => {
    if (!taskNumber) return null
    const commonProps = { key: `${activeTaskIndex}-${taskNumber}`, taskNumber, onDone: onTaskDone }
    if (activeTaskIndex === 0) return <SluInverseAdjTaskCombined {...commonProps} />
    if (activeTaskIndex === 1) return <SluMatrixMethodTaskCombined {...commonProps} />
    return <SluCramerTaskCombined {...commonProps} />
  }

  const buildReportDoc = () => {
    // Helper function to serialize arrays to strings to avoid Firestore nested array error
    const serializeAnswer = (answer) => {
      if (Array.isArray(answer)) {
        return JSON.stringify(answer);
      }
      return answer ?? null;
    }

    return {
      student: { lastName, firstName, group: groupName },
      variant: taskNumber,
      createdAt: serverTimestamp(),
      totals: { totalMax, totalPoints, totalPercent },
      tasks: TASK_TITLES.map((title, idx) => ({
        index: idx + 1,
        title,
        max: TASK_MAXES[idx],
        points: perTaskPoints[idx] ?? 0,
        percent: perTaskPercents[idx] ?? 0,
        initialData: { A: results[idx]?.A ? JSON.stringify(results[idx].A) : null }, // Also serialize initial matrix
        rows: (results[idx]?.rows ?? []).map(
          ({ key, label, w, gained, correctAnswer, studentAnswer }) => ({
            key, label,
            maxPercent: w,
            gainedPercent: gained,
            // Use the helper function to serialize answers
            correctAnswer: serializeAnswer(correctAnswer),
            studentAnswer: serializeAnswer(studentAnswer),
          })
        )
      }))
    }
  }

  const handleSaveReport = async () => {
    try {
      setSaveStatus('saving')
      setSaveError('')
      const doc = buildReportDoc()
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        throw new Error('Нет сети. Проверьте подключение и попробуйте сохранить вручную.')
      }
      const col = collection(db, 'SluReports')
      const docRef = await addDoc(col, doc)
      setSavedDocId(docRef.id)
      setSaveStatus('ok')
    } catch (err) {
      setSaveStatus('error')
      setSaveError(err?.message || String(err))
      setRetryCnt(c => c + 1)
    }
  }

  useEffect(() => {
    const doneCount = results.filter(Boolean).length
    if (showReport && doneCount === 3 && saveStatus === 'idle') {
      handleSaveReport()
    }
  }, [showReport, results, saveStatus])

  useEffect(() => {
    const doneCount = results.filter(Boolean).length
    if (!(showReport && doneCount === 3)) return
    if (saveStatus === 'error' && retryCnt > 0 && retryCnt <= MAX_RETRIES) {
      const backoffMs = 1500 * retryCnt
      const t = setTimeout(() => { handleSaveReport() }, backoffMs)
      return () => clearTimeout(t)
    }
  }, [saveStatus, retryCnt, showReport, results])

  const renderReport = () => {
    const flatRows = []
    results.forEach((r, idx) => {
      if (!r) return;
      flatRows.push({ header: true, key: `h-${idx}`, title: TASK_TITLES[idx], taskIdx: idx })
      r.rows.forEach(row => flatRows.push({ ...row, key: `${idx}-${row.key}`, taskIdx: idx }))
    })

    return (
      <Card>
        <h2 style={{ margin: '0 0 12px 0' }}>Отчёт</h2>
        <style>{`.rpt-wrap{background:#eef6ff;padding:10px;display:inline-block;border-radius:6px}.rpt{border-collapse:collapse;background:#fff;min-width:680px}.rpt th,.rpt td{border:1px solid #9bb5d1;padding:4px 8px;text-align:center;vertical-align:middle;line-height:1.1}.rpt thead th{background:#eaf2ff;color:#003e91;font-weight:700}.rpt tfoot td{background:#eaf2ff;font-weight:700;color:#003e91}.rpt td.left{text-align:left}.rpt td.hdr{background:#f7faff;color:#002e78;font-weight:700;text-align:left}.sub{font-weight:400;color:#4e6aa5}.blue{color:#0041c4;font-weight:bold}`}</style>
        <div className="rpt-wrap">
          <div style={{ marginBottom:8 }}>
            <b>ФИО:</b> {lastName} {firstName} &nbsp;&nbsp; <b>Группа:</b> {groupName} &nbsp;&nbsp; <b>Вариант №:</b> {taskNumber}
          </div>
          <table className="rpt">
            <thead><tr><th>макс, %</th><th>пункт</th><th>баллы, %</th></tr></thead>
            <tbody>
              {flatRows.map(r => {
                if (r.header) {
                  const pts = perTaskPoints[r.taskIdx] ?? 0, maxPts = TASK_MAXES[r.taskIdx], pct = perTaskPercents[r.taskIdx] ?? 0
                  return (<tr key={r.key}><td colSpan={3} className="hdr">{r.title} &nbsp;<span className="sub">({pct}% = {pts} из {maxPts} баллов)</span></td></tr>)
                }
                return (<tr key={r.key}><td>{Math.round(r.w)}</td><td className="left"><LatexCell latex={toLatexLabel(r.label)} /></td><td>{Math.round(r.gained)}</td></tr>)
              })}
            </tbody>
            <tfoot><tr><td>20</td><td className="left">ИТОГО</td><td>{totalPercent}%</td></tr></tfoot>
          </table>
          <div style={{ textAlign:'center', marginTop:12 }}><span className="blue">Общая оценка {totalPercent}% = {totalPoints} балл(ов) из {totalMax}</span></div>
          <div style={{ marginTop:14, display:'flex', gap:8, alignItems:'center' }}>
            {saveStatus === 'idle' && <Alert type="info" message="Отчёт будет сохранён автоматически." />}
            {saveStatus === 'saving' && <Alert type="info" showIcon message="Сохранение отчёта..." />}
            {saveStatus === 'ok' && <Alert type="success" showIcon message={`Отчёт сохранён! (ID: ${savedDocId})`} />}
            {saveStatus === 'error' && (
              <><Alert type="error" showIcon message="Ошибка при сохранении" description={`${saveError}${retryCnt <= MAX_RETRIES ? ' • Повторная попытка...' : ''}`}/><Button type="primary" onClick={handleSaveReport}>Повторить</Button></>
            )}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="App">
      <header className="App-header" />
      <form onSubmit={handleSubmitID}>
        <Container>
          <h1>СЛАУ</h1>
          <Alert type="info" showIcon message="Формат чисел" description="В качестве разделителя дробной части десятичного числа необходимо использовать точку(не запятую)! Десятичные числа необходимо вводить с точностью до 4-ех знаков после запятой!" style={{ marginBottom: 12 }}/>
          <h3>Введите ваши данные:</h3>
          <Row gutter={16} style={{ marginBottom: 6 }}><label style={{ width: 90 }}>Фамилия</label><Col span={16}><Input type="text" onChange={(e)=>setLName(e.target.value)} value={lastName} required disabled={disabled} /></Col></Row>
          <Row gutter={16} style={{ marginBottom: 6 }}><label style={{ width: 90 }}>Имя</label><Col span={16}><Input type="text" onChange={(e)=>setFName(e.target.value)} value={firstName} required disabled={disabled} /></Col></Row>
          <Row gutter={16} style={{ marginBottom: 6 }}><label style={{ width: 90 }}>Группа</label><Col span={16}><Input type="text" onChange={(e)=>setGName(e.target.value)} value={groupName} required disabled={disabled} /></Col></Row>
          <Row gutter={16} style={{ marginBottom: 6 }}><label style={{ width: 90 }}>Вариант №</label><Col span={6}><Input type="number" step="1" required onWheel={(e)=>e.currentTarget.blur()} onChange={(e)=>setTaskNumber(Number(e.target.value))} min={1} max={60} disabled={disabled} /></Col></Row>
          <StyledButton type="submit" disabled={disabled}>сохранить</StyledButton>
        </Container>
      </form>
      {!showReport && disabled && (
        <Card>
          <h2 style={{ marginTop:0 }}>{TASK_TITLES[activeTaskIndex]}</h2>
          {!doneForTask && renderCurrentTask()}
          {doneForTask && (
            <><Alert type="success" showIcon message={`Задание ${activeTaskIndex + 1} завершено.`} description="Нажмите «Следующее задание», чтобы продолжить." style={{ marginBottom: 12 }}/><Button type="primary" onClick={goNextTask}>{activeTaskIndex < 2 ? 'Следующее задание' : 'Показать отчёт'}</Button></>
          )}
        </Card>
      )}
      {showReport && results.length === 3 && renderReport()}
    </div>
  )
}

