import { useState, useEffect } from 'react'
import './App.css'
import { Preview } from './components/Preview/Preview'
import { YamlEditor } from './components/Editor/YamlEditor'
import { FormEditor } from './components/Editor/FormEditor'
import { mockResume } from './mockData'
import type { Resume } from './schema/resumeSchema'
import { Button } from './components/Button'
import { Printer } from 'lucide-react'

const STORAGE_KEY = 'shokumukeirekisho_data'

function App() {
  const [isEditMode, setIsEditMode] = useState(true)
  const [activeTab, setActiveTab] = useState<'form' | 'yaml'>('form')

  const [resumeData, setResumeData] = useState<Resume>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        // ignore corrupt data, fall through to default
      }
    }
    return mockResume
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData))
  }, [resumeData])

  return (
    <div className="container">
      <header className="no-print">
        <div className="controls">
          <button className={isEditMode ? 'active' : ''} onClick={() => setIsEditMode(true)}>
            Edit Mode
          </button>
          <button className={!isEditMode ? 'active' : ''} onClick={() => setIsEditMode(false)}>
            Preview Mode
          </button>
        </div>
        {!isEditMode && (
          <Button variant="primary" onClick={() => window.print()}>
            <Printer size={16} /> PDF出力
          </Button>
        )}
      </header>

      <main>
        {isEditMode ? (
          <div className="editor-view">
            <div className="editor-tabs">
              <button
                className={`tab-btn ${activeTab === 'yaml' ? 'active' : ''}`}
                onClick={() => setActiveTab('yaml')}
              >
                YAML
              </button>
              <button
                className={`tab-btn ${activeTab === 'form' ? 'active' : ''}`}
                onClick={() => setActiveTab('form')}
              >
                Form
              </button>
            </div>
            {activeTab === 'yaml' ? (
              <YamlEditor data={resumeData} onChange={setResumeData} />
            ) : (
              <FormEditor data={resumeData} onChange={setResumeData} />
            )}
          </div>
        ) : (
          <div className="preview-view">
            <Preview data={resumeData} />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
