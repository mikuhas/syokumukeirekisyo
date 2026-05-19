import { useState, useEffect } from 'react'
import './App.css'
import { Preview } from './components/Preview/Preview'
import { YamlEditor } from './components/Editor/YamlEditor'
import { FormEditor } from './components/Editor/FormEditor'
import type { Section } from './components/Editor/FormSidebar'
import { mockResume } from './mockData'
import type { Resume } from './schema/resumeSchema'
import { Button } from './components/Button'
import { Printer, Menu, X, User, Link as LinkIcon, Briefcase, LayoutList } from 'lucide-react'

const STORAGE_KEY = 'shokumukeirekisho_data'
const SECTION_ORDER_KEY = 'shokumukeirekisho_section_order'
export const DEFAULT_SECTION_ORDER = ['summary', 'skill-stack', 'self-promotion', 'work-experience'] as const
export type SectionId = typeof DEFAULT_SECTION_ORDER[number]

const SECTION_ITEMS: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: 'basic',      label: '基本情報',       icon: User },
  { id: 'links',      label: 'リンク・資格',   icon: LinkIcon },
  { id: 'experience', label: '職務経歴',       icon: Briefcase },
  { id: 'order',      label: 'セクション順序', icon: LayoutList },
]

function App() {
  const [isEditMode, setIsEditMode] = useState(true)
  const [activeTab, setActiveTab] = useState<'form' | 'yaml'>('form')
  const [activeSection, setActiveSection] = useState<Section>('basic')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [resumeData, setResumeData] = useState<Resume>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try { return JSON.parse(saved) } catch {}
    }
    return mockResume
  })

  const [sectionOrder, setSectionOrder] = useState<SectionId[]>(() => {
    const saved = localStorage.getItem(SECTION_ORDER_KEY)
    if (saved) {
      try { return JSON.parse(saved) } catch {}
    }
    return [...DEFAULT_SECTION_ORDER]
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData))
  }, [resumeData])

  useEffect(() => {
    localStorage.setItem(SECTION_ORDER_KEY, JSON.stringify(sectionOrder))
  }, [sectionOrder])

  const closeMenu = () => setMobileMenuOpen(false)

  const handleSectionSelect = (id: Section) => {
    setActiveSection(id)
    closeMenu()
  }

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
        <button
          className="sidebar-toggle-btn"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="メニュー"
        >
          <Menu size={20} />
        </button>
        <Button variant="primary" onClick={() => window.print()}>
          <Printer size={16} /> PDF出力
        </Button>
      </header>

      {/* Mobile global drawer — accessible from both Edit and Preview mode */}
      {mobileMenuOpen && (
        <>
          <div className="sidebar-overlay" onClick={closeMenu} />
          <aside className="form-sidebar mobile-open">
            <button className="sidebar-close-btn" onClick={closeMenu} aria-label="メニューを閉じる">
              <X size={20} />
            </button>
            {/* Section navigation */}
            <div className="sidebar-menu">
              {SECTION_ITEMS.map(item => (
                <button
                  key={item.id}
                  type="button"
                  className={`sidebar-item ${isEditMode && activeSection === item.id ? 'active' : ''}`}
                  onClick={() => handleSectionSelect(item.id)}
                >
                  <item.icon size={18} /><span>{item.label}</span>
                </button>
              ))}
            </div>
          </aside>
        </>
      )}

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
              <FormEditor
                data={resumeData}
                onChange={setResumeData}
                sectionOrder={sectionOrder}
                setSectionOrder={setSectionOrder}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
              />
            )}
          </div>
        ) : (
          <div className="preview-view">
            <Preview data={resumeData} sectionOrder={sectionOrder} />
          </div>
        )}
        {/* 印刷専用プレビュー: 常時DOMに保持、@media print でのみ表示 */}
        <div className="print-only-preview">
          <Preview data={resumeData} sectionOrder={sectionOrder} />
        </div>
      </main>
    </div>
  )
}

export default App
