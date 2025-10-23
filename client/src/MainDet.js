// src/MainDet.jsx
import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { toKvPairs, mergeKv } from './utils/answers'
import { Input, Row, Col, Button, Alert } from 'antd'

// Заданиявы
import DetTriangleTaskCombined from './DetTriangleTaskCombined'
import DetCofactorEffTaskCombined from './DetCofactorEffTaskCombined'
import DetCofactorTaskCombined from './DetCofactorTaskCombined'

// KaTeX
import katex from 'katex'
import 'katex/dist/katex.min.css'

// Firebase
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

// распределение максимумов по заданиям: [Задание1, Задание2, Задание3]
const TASK_MAXES = [6, 7, 7] // суммарно 25

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

function toLatexLabel(label = '') {
  const aMatch = label.match(/A_\{(\d\d)\}/)
  if (aMatch) return `\\text{Алгебраическое дополнение } A`

  const mMatch = label.match(/M_\{(\d\d)\}/)
  if (mMatch) return `\\text{Минор } M`

  if (/det\(A\)/i.test(label) || /Δ/.test(label)) return `\\text{Определитель }\\det(A)`

  const pMatchVal = label.match(/Значение P(\d)/i)
  if (pMatchVal) return `\\text{Значение }P_{${pMatchVal[1]}}`
  const pMatchForm = label.match(/Формирование P(\d)/i)
  if (pMatchForm) return `\\text{Формирование }P_{${pMatchForm[1]}}`

  const escaped = label
    .replace(/\\/g, '\\\\')
    .replace(/\{/g, '\\{').replace(/\}/g, '\\}')
    .replace(/\%/g, '\\%').replace(/\_/g, '\\_')
  return `\\text{${escaped}}`
}

const TASK_TITLES = ['']


export default function MainDet() {
  // ФИО/Вариант/Группа
  const [taskNumber, setTaskNumber] = useState()
  const [lastName, setLName] = useState('')
  const [firstName, setFName] = useState('')
  const [group, setGroup] = useState('')
  const [disabled, setDisabled] = useState(false)

  // Навигация по мини-экзамену
  const [activeTaskIndex, setActiveTaskIndex] = useState(0)
  const [doneForTask, setDoneForTask] = useState(false)
  const [results, setResults] = useState([])        // [{ scorePercent, rows, ... }, ...]
  const [showReport, setShowReport] = useState(false)

  // Статусы сохранения
  const [saveStatus, setSaveStatus] = useState('idle') // idle | saving | ok | error
  const [savedDocId, setSavedDocId] = useState(null)
  const [saveError, setSaveError] = useState('')
  const [retryCnt, setRetryCnt] = useState(0)

  // Суммарные баллы/проценты (округление до целого)
  const totalMax = useMemo(() => TASK_MAXES.reduce((a,b)=>a+b,0), [])
  const perTaskPoints = useMemo(
    () => results.map((r, idx) =>
      r ? Math.round((r.scorePercent / 100) * TASK_MAXES[idx]) : 0
    ),
    [results]
  )
  const perTaskPercents = useMemo(
    () => results.map((r) => r ? Math.round(r.scorePercent) : 0),
    [results]
  )
  const totalPoints = useMemo(
    () => perTaskPoints.reduce((s,x)=>s+x,0),
    [perTaskPoints]
  )
  const totalPercent = useMemo(
    () => Math.round((totalPoints / totalMax) * 100),
    [totalPoints, totalMax]
  )

  // Форма
  const handleSubmitID = (e) => {
    e.preventDefault()
    if (!firstName || !lastName || !taskNumber || !group) return
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

  // Колбэк от задач («Проверить»)
  const onTaskDone = (payload) => {
    const withKey = { ...payload, taskKey: activeTaskIndex }
    setResults(prev => {
      const cp = prev.slice()
      cp[activeTaskIndex] = withKey
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
    setSaveStatus('idle')
    setSavedDocId(null)
    setSaveError('')
    setRetryCnt(0)
  }, [taskNumber])

  const renderCurrentTask = () => {
    if (!taskNumber) return null
    const commonProps = { key: `${activeTaskIndex}-${taskNumber}`, taskNumber, onDone: onTaskDone }
    if (activeTaskIndex === 0) return <DetTriangleTaskCombined {...commonProps} />
    if (activeTaskIndex === 1) return <DetCofactorEffTaskCombined {...commonProps} />
    return <DetCofactorTaskCombined {...commonProps} />
  }

  // Подготовка документа для Firestore
  const buildReportDoc = () => {
    return {
      student: {
        lastName,
        firstName,
        group
      },
      variant: taskNumber,
      createdAt: serverTimestamp(),
      totals: {
        totalMax,
        totalPoints,
        totalPercent
      },
      tasks: TASK_TITLES.map((title, idx) => ({
        index: idx + 1,
        title,
        max: TASK_MAXES[idx],
        points: perTaskPoints[idx] ?? 0,
        percent: perTaskPercents[idx] ?? 0,
        rows: (results[idx]?.rows ?? []).map(
          ({ key, label, w, gained, correct, entered }) => ({
            key,
            label,
            maxPercent: w,
            gainedPercent: gained,
            // новое:
            correctAnswer: correct ?? null,
            studentAnswer: entered ?? null
          })
        )
        
      }))
    }
  }

  // Сохранение в Firestore
  const handleSaveReport = async () => {
    try {
      setSaveStatus('saving')
      setSaveError('')
      const doc = buildReportDoc()

      // Если офлайн — сразу бросим управляемую ошибку (чтобы не ждать таймаутов)
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        throw new Error('Нет сети: вы офлайн. Попробуем ещё раз...')
      }

      const col = collection(db, '00_DetReports')
      const docRef = await addDoc(col, doc)
      setSavedDocId(docRef.id)
      setSaveStatus('ok')
    } catch (err) {
      setSaveStatus('error')
      setSaveError(err?.message || String(err))
      setRetryCnt(c => c + 1) // увеличиваем счётчик для авто-ретрая
    }
  }

  // АВТОСОХРАНЕНИЕ при открытии отчёта и наличии 3 результатов
  useEffect(() => {
    const doneCount = results.filter(Boolean).length
    if (showReport && doneCount === 3 && saveStatus === 'idle') {
      handleSaveReport()
    }
  }, [showReport, results, saveStatus]) // eslint-disable-line react-hooks/exhaustive-deps

  // АВТО-РЕТРАИ при ошибке: максимум MAX_RETRIES, экспон. задержка
  useEffect(() => {
    const doneCount = results.filter(Boolean).length
    if (!(showReport && doneCount === 3)) return

    if (saveStatus === 'error' && retryCnt > 0 && retryCnt <= MAX_RETRIES) {
      const backoffMs = 1500 * retryCnt // 1.5s, 3.0s
      const t = setTimeout(() => {
        // повторяем попытку
        handleSaveReport()
      }, backoffMs)
      return () => clearTimeout(t)
    }
  }, [saveStatus, retryCnt, showReport, results]) // eslint-disable-line react-hooks/exhaustive-deps

  const renderReport = () => {
    const flatRows = []
    results.forEach((r, idx) => {
      flatRows.push({ header: true, key: `h-${idx}`, title: TASK_TITLES[idx], taskIdx: idx })
      r.rows.forEach(row => flatRows.push({ ...row, key: `${idx}-${row.key}`, taskIdx: idx }))
    })

    return (
      <Card>
        <h2 style={{ margin: '0 0 12px 0' }}>Отчёт</h2>
        <style>{`
          .rpt-wrap { background:#eef6ff; padding:14px; display:inline-block; border-radius:4px; }
          .rpt { border-collapse:collapse; background:#ffffff; min-width: 720px; }
          .rpt th, .rpt td { border:1px solid #9bb5d1; padding:6px 10px; text-align:center; vertical-align:middle; }
          .rpt thead th { background:#eaf2ff; color:#003e91; font-weight:700; }
          .rpt tfoot td { background:#eaf2ff; font-weight:700; color:#003e91; }
          .rpt td.left { text-align:left; }
          .blue { color:#0041c4; font-weight:bold; }
          .hdr { background:#f7fbff; font-weight:700; color:#002f6c; text-align:left; }
          .sub { color:#3a5c9a; font-weight:600; }
        `}</style>

        <div className="rpt-wrap">
          <div style={{ marginBottom:8 }}>
            <b>ФИО:</b> {lastName} {firstName} &nbsp;&nbsp;
            <b>Группа:</b> {group} &nbsp;&nbsp;
            <b>Вариант №:</b> {taskNumber}
          </div>

          <table className="rpt">
            <thead>
              <tr>
                <th>макс, %</th>
                <th>пункт</th>
                <th>баллы, %</th>
              </tr>
            </thead>
            <tbody>
              {flatRows.map(r => {
                if (r.header) {
                  const pts = perTaskPoints[r.taskIdx] ?? 0
                  const maxPts = TASK_MAXES[r.taskIdx]
                  const pct = perTaskPercents[r.taskIdx] ?? 0
                  return (
                    <tr key={r.key}>
                      <td colSpan={3} className="hdr">
                        {r.title} &nbsp;
                        <span className="sub">
                          ({pct}% = {pts} из {maxPts} баллов)
                        </span>
                      </td>
                    </tr>
                  )
                }
                const latex = toLatexLabel(r.label)
                return (
                  <tr key={r.key}>
                    <td>{r.w}</td>
                    <td className="left"><LatexCell latex={latex} /></td>
                    <td>{r.gained}</td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr>
                <td>20</td>
                <td className="left">ИТОГО</td>
                <td>{totalPercent}%</td>
              </tr>
            </tfoot>
          </table>

          <div style={{ textAlign:'center', marginTop:12 }}>
            <span className="blue">
              Общая оценка {totalPercent}% = {totalPoints} балл(ов) из {totalMax}
            </span>
          </div>

          {/* Статусы автосохранения + ручной повтор только при ошибке */}
          <div style={{ marginTop:14, display:'flex', gap:8, alignItems:'center' }}>
            {saveStatus === 'saving' && (
              <Alert type="info" showIcon message="Сохраняю отчёт..." />
            )}
            {saveStatus === 'error' && (
              <>
                <Alert
                  type="error"
                  showIcon
                  message="Ошибка при сохранении"
                  description={`${saveError}${retryCnt <= MAX_RETRIES ? ' • Попробуем ещё раз автоматически.' : ''}`}
                />
                <Button type="primary" onClick={handleSaveReport}>
                  Повторить сохранение
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="App">
      <header className="App-header" />
      {/* Форма ID */}
      <form onSubmit={handleSubmitID}>
        <Container>
          <h1>Матрицы СРС</h1>
          <Alert
            type="info"
            showIcon
            message="Формат чисел"
            description="Вводить десятичные числа нужно с запятой!"
            style={{ marginBottom: 12 }}
          />
          <h3>Введите ваши данные:</h3>

          {/* Группа */}
          <Row gutter={20} style={{ marginBottom: 8 }}>
            <label style={{ width: 90 }}>Группа</label>
            <Col span={16}>
              <Input
                type="text"
                name="group"
                onChange={(e)=>setGroup(e.target.value)}
                value={group}
                required
                disabled={disabled}
              />
            </Col>
          </Row>

          <Row gutter={20} style={{ marginBottom: 8 }}>
            <label style={{ width: 90 }}>Фамилия</label>
            <Col span={16}>
              <Input type="text" name="lastName" onChange={(e)=>setLName(e.target.value)} value={lastName} required disabled={disabled} />
            </Col>
          </Row>

          <Row gutter={20} style={{ marginBottom: 8 }}>
            <label style={{ width: 90 }}>Имя</label>
            <Col span={16}>
              <Input type="text" name="firstName" onChange={(e)=>setFName(e.target.value)} value={firstName} required disabled={disabled} />
            </Col>
          </Row>

          <Row gutter={20} style={{ marginBottom: 8 }}>
            <label style={{ width: 90 }}>Номер варианта</label>
            <Col span={6}>
              <Input
                type="number"
                step="1"
                required
                onWheel={(e)=>e.currentTarget.blur()}
                name="taskNumber"
                onChange={(e)=>setTaskNumber(Number(e.target.value))}
                min={1}
                max={60}
                disabled={disabled}
              />
            </Col>
          </Row>

          <StyledButton type="submit" disabled={disabled}>сохранить</StyledButton>
        </Container>
      </form>

      {/* Экран экзамена */}
      {!showReport && disabled && (
        <Card>
          <h2 style={{ marginTop:0 }}>{TASK_TITLES[activeTaskIndex]}</h2>

          {!doneForTask && renderCurrentTask()}

          {doneForTask && (
            <>
              <Alert
                type="success"
                showIcon
                message={`Задание ${activeTaskIndex + 1} завершено.`}
                description="Нажмите «Следующее задание», чтобы продолжить."
                style={{ marginBottom: 12 }}
              />
              <Button type="primary" onClick={goNextTask}>
                {activeTaskIndex < 2 ? 'Следующее задание' : 'Показать отчёт'}
              </Button>
            </>
          )}
        </Card>
      )}

      {/* Единый отчёт */}
      {showReport && results.filter(Boolean).length === 3 && renderReport()}
    </div>
  )
}
