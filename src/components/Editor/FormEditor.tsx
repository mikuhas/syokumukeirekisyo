import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import type { Control, UseFormRegister } from "react-hook-form";
import type { Resume } from "../../schema/resumeSchema";
import { Button } from "../Button";
import {
  Plus,
  Trash2,
  GripVertical,
  Download,
  Upload,
  User,
  Award,
  Link as LinkIcon,
  Briefcase,
} from "lucide-react";
import yaml from "js-yaml";
import { PREDEFINED_TECH_STACK } from '../../constants/techStack';

interface FormEditorProps {
  data: Resume;
  onChange: (newData: Resume) => void;
}

type Section = "basic" | "links" | "experience";

export const FormEditor: React.FC<FormEditorProps> = ({ data, onChange }) => {
  const [activeSection, setActiveSection] = useState<Section>("basic");
  const { register, control, watch, setValue, reset } = useForm<Resume>({
    defaultValues: data,
  });

  const {
    fields: linkFields,
    append: appendLink,
    remove: removeLink,
  } = useFieldArray({
    control,
    name: "profile.links" as any,
  });

  const {
    fields: expFields,
    append: appendExp,
    remove: removeExp,
  } = useFieldArray({
    control,
    name: "workExperiences",
  });

  React.useEffect(() => {
    const subscription = watch((value) => {
      if (value) onChange(value as Resume);
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  const handleExport = () => {
    const blob = new Blob([yaml.dump(watch())], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.yml";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = yaml.load(event.target?.result as string) as Resume;
        reset(parsed);
        onChange(parsed);
      } catch (err) {
        alert("YAMLの読み込みに失敗しました。");
      }
    };
    reader.readAsText(file);
  };

  const menuItems = [
    { id: "basic", label: "基本情報", icon: User },
    { id: "links", label: "リンク・資格", icon: LinkIcon },
    { id: "experience", label: "職務経歴", icon: Briefcase },
  ];

  return (
    <div className="form-editor-container">
      <aside className="form-sidebar">
        <div className="sidebar-menu">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={`sidebar-item ${activeSection === item.id ? "active" : ""}`}
              onClick={() => setActiveSection(item.id as Section)}
              as="button"
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Button>
          ))}
          
          {/* プロジェクトナビゲーション (職務経歴セクション時のみ表示) */}
          {activeSection === 'experience' && (
            <div style={{ padding: '10px 20px', fontSize: '0.85rem', color: '#6b7280', borderTop: '1px solid #eee' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>プロジェクト一覧</div>
              {expFields.map((exp, expIdx) => (
                <div key={exp.id} style={{ marginBottom: '8px' }}>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>{watch(`workExperiences.${expIdx}.company`) || `経歴 #${expIdx + 1}`}</div>
                  {(watch(`workExperiences.${expIdx}.projects`) || []).map((proj: any, projIdx: number) => (
                    <div key={projIdx} style={{ paddingLeft: '10px', fontSize: '0.8rem', cursor: 'pointer', marginBottom: '2px' }} onClick={() => {
                        const element = document.getElementById(`editor-project-${expIdx}-${projIdx}`);
                        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}>
                      • {proj.name || '無題のプロジェクト'}
                    </div>

                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="sidebar-actions">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="w-full"
          >
            <Download size={14} /> エクスポート
          </Button>
          <label className="w-full">
            <input type="file" accept=".yml,.yaml" onChange={handleImport} style={{ display: 'none' }} />
            <Button variant="outline" size="sm" className="w-full" as="span" style={{ cursor: 'pointer' }}>
              <Upload size={14} /> インポート
            </Button>
          </label>
        </div>
      </aside>

      <div className="form-content-area">
        {activeSection === "basic" && (
          <section className="form-card">
            <div className="card-header">
              <User size={20} />
              <h3>基本情報</h3>
            </div>
            <div className="form-grid-full">
              <div className="form-group">
                <label>名前</label>
                <input {...register("profile.name")} placeholder="山田 太郎" />
              </div>
              <div className="form-group">
                <label>職務要約</label>
                <textarea
                  {...register("profile.summary")}
                  rows={10}
                  placeholder="これまでの経験の概要や強みを簡潔に入力してください。"
                />
              </div>
              <div className="form-group">
                <label>自己PR</label>
                <textarea
                  {...register("profile.selfPromotion")}
                  rows={15}
                  placeholder="自身のアピールポイントや実績を詳細に入力してください。"
                />
              </div>
            </div>
          </section>
        )}

        {activeSection === "links" && (
          <div className="form-vertical-stack">
            <section className="form-card">
              <div className="card-header">
                <LinkIcon size={20} />
                <h3>リンク</h3>
              </div>
              <div className="links-list">
                {linkFields.map((field, index) => (
                  <div key={field.id} className="item-row-card">
                    <div className="row-inputs">
                      <input
                        {...register(`profile.links.${index}.label` as any)}
                        placeholder="GitHub等"
                      />
                      <input
                        {...register(`profile.links.${index}.url` as any)}
                        placeholder="URL"
                      />
                    </div>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeLink(index)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => appendLink({ label: "", url: "" })}
                >
                  <Plus size={16} /> リンクを追加
                </Button>
              </div>
            </section>

            <section className="form-card">
              <div className="card-header">
                <Award size={20} />
                <h3>資格</h3>
              </div>
              <CertEditor
                register={register}
                watch={watch}
                setValue={setValue}
              />
            </section>
          </div>
        )}

        {activeSection === "experience" && (
          <div className="form-vertical-stack">
            <div className="section-intro">
              <h3>職務経歴</h3>
              <p>
                経歴を追加・編集し、その中でプロジェクトの実績を詳しく記載します。
              </p>
            </div>
            {expFields.map((field, index) => (
              <div key={field.id} className="experience-card-group">
                <div className="card-group-header">
                  <div className="header-title">
                    <GripVertical className="drag-handle" size={20} />
                    <h4>経歴 #{index + 1}</h4>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExp(index)}
                  >
                    この経歴を削除
                  </Button>
                </div>
                <div className="form-grid-2col">
                  <div className="form-group">
                    <label>会社名</label>
                    <input
                      {...register(`workExperiences.${index}.company`)}
                      placeholder="株式会社〇〇"
                    />
                  </div>
                  <div className="form-group">
                    <label>開始年月</label>
                    <input
                      type="month"
                      {...register(`workExperiences.${index}.startDate`)}
                    />
                  </div>
                  <div className="form-group">
                    <label>終了年月</label>
                    <input
                      type="month"
                      {...register(`workExperiences.${index}.endDate`)}
                      disabled={watch(
                        `workExperiences.${index}.isCurrentlyWorking`,
                      )}
                    />
                  </div>
                  <div className="form-group">
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <input
                        type="checkbox"
                        {...register(
                          `workExperiences.${index}.isCurrentlyWorking`,
                        )}
                        style={{ width: "auto" }}
                      />
                      現在も在籍中
                    </label>
                  </div>
                  <div className="form-group full-width">
                    <label>雇用形態</label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {["正社員", "契約社員", "派遣社員", "アルバイト/パート", "その他"].map((status) => (
                        <button
                          key={status}
                          type="button"
                          className={`form-chip ${watch(`workExperiences.${index}.employmentStatus`) === status ? 'active' : ''}`}
                          onClick={() => setValue(`workExperiences.${index}.employmentStatus`, status)}
                          style={{ 
                            borderColor: watch(`workExperiences.${index}.employmentStatus`) === status ? '#4f46e5' : undefined,
                            backgroundColor: watch(`workExperiences.${index}.employmentStatus`) === status ? '#eef2ff' : undefined
                          }}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                <ProjectFields
                  nestIndex={index}
                  control={control}
                  register={register}
                  watch={watch}
                  setValue={setValue}
                />
              </div>
            ))}
            <Button
              variant="primary"
              size="lg"
              onClick={() =>
                appendExp({
                  company: "",
                  employmentStatus: "",
                  startDate: "2025-05",
                  isCurrentlyWorking: true,
                  projects: [],
                })
              }
            >
              <Plus size={18} /> 職務経歴を追加
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const CertEditor = ({
  register,
  watch,
  setValue,
}: {
  register: any;
  watch: any;
  setValue: any;
}) => {
  const certs = watch("profile.certifications") || [];

  return (
    <div className="cert-form">
      <div className="cert-items-list">
        {certs.map((_: any, index: number) => (
          <div key={index} className="item-row-card">
            <input
              {...register(`profile.certifications.${index}`)}
              placeholder="AWS認定資格..."
            />
            <button
              type="button"
              className="delete-btn icon-only"
              onClick={() => {
                const newCerts = [...certs];
                newCerts.splice(index, 1);
                setValue("profile.certifications", newCerts);
              }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button
          type="button"
          className="add-btn-outline"
          onClick={() => {
            setValue("profile.certifications", [...certs, ""]);
          }}
        >
          <Plus size={16} /> 資格を追加
        </button>
      </div>
    </div>
  );
};

const SkillStackEditor = ({ path, watch, setValue }: { 
  path: string,
  watch: any,
  setValue: any
}) => {
  const skillStack = watch(path) || {};
  const categories = Object.keys(PREDEFINED_TECH_STACK);

  const addItem = (cat: string, item: string) => {
    const current = skillStack[cat] || [];
    if (!current.find((i: any) => i.name === item)) {
      setValue(`${path}.${cat}`, [...current, { name: item, version: '' }]);
    }
  };

  const removeItem = (cat: string, item: string) => {
    const current = skillStack[cat] || [];
    setValue(`${path}.${cat}`, current.filter((i: any) => i.name !== item));
  };

  const updateVersion = (cat: string, item: string, version: string) => {
    const current = skillStack[cat] || [];
    setValue(`${path}.${cat}`, current.map((i: any) => i.name === item ? { name: item, version } : i));
  };

  return (
    <div className="skill-stack-form">
      <div className="categories-grid">
        {categories.map((cat) => (
          <div key={cat} className="category-item-card">
            <div className="category-item-header" style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
              <span className="category-tag">【{cat}】</span>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <select onChange={(e) => addItem(cat, e.target.value)} value="" style={{ flex: 1, padding: '4px' }}>
                <option value="" disabled>技術を選択して追加</option>
                {PREDEFINED_TECH_STACK[cat as keyof typeof PREDEFINED_TECH_STACK].map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className="chips-wrapper" style={{ flexDirection: 'column' }}>
              {(skillStack[cat] || []).map((item: any) => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <button type="button" className="form-chip active" onClick={() => removeItem(cat, item.name)} style={{ minWidth: '100px', backgroundColor: '#eef2ff' }}>
                    {item.name} ×
                  </button>
                  <input 
                    type="text" 
                    placeholder="Version" 
                    value={item.version || ''}
                    onChange={(e) => updateVersion(cat, item.name, e.target.value)}
                    style={{ width: '80px', padding: '2px 4px' }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ResponsibilityEditor = ({ nestIndex, projectIndex, control, register }: { 
  nestIndex: number, 
  projectIndex: number, 
  control: any, 
  register: any 
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `workExperiences.${nestIndex}.projects.${projectIndex}.responsibilities` as any,
  });

  return (
    <div className="responsibility-form">
      {fields.map((field, index) => (
        <div key={field.id} className="item-row-card" style={{ marginBottom: '8px', display: 'flex', gap: '8px' }}>
          <input {...register(`workExperiences.${nestIndex}.projects.${projectIndex}.responsibilities.${index}` as any)} placeholder="担当業務" />
          <Button variant="danger" size="sm" onClick={() => remove(index)}><Trash2 size={16} /></Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => append('')}><Plus size={16} /> 担当業務を追加</Button>
    </div>
  );
};

const ListEditor = ({ nestIndex, projectIndex, control, register, name, placeholder }: { 
  nestIndex: number, 
  projectIndex: number, 
  control: any, 
  register: any,
  name: string,
  placeholder: string
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `workExperiences.${nestIndex}.projects.${projectIndex}.${name}` as any,
  });

  return (
    <div className="list-form">
      {fields.map((field, index) => (
        <div key={field.id} className="item-row-card" style={{ marginBottom: '8px', display: 'flex', gap: '8px' }}>
          <input {...register(`workExperiences.${nestIndex}.projects.${projectIndex}.${name}.${index}` as any)} placeholder={placeholder} />
          <Button variant="danger" size="sm" onClick={() => remove(index)}><Trash2 size={16} /></Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => append('')}><Plus size={16} /> 追加</Button>
    </div>
  );
};

const ProjectFields = ({
  nestIndex,
  control,
  register,
  watch,
  setValue,
}: {
  nestIndex: number;
  control: Control<Resume>;
  register: UseFormRegister<Resume>;
  watch: any;
  setValue: any;
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `workExperiences.${nestIndex}.projects`,
  });

  return (
    <div className="projects-container-nested">
      <div className="nested-header">
        <h5>プロジェクト実績</h5>
      </div>
      {fields.map((item, k) => (
        <div key={item.id} id={`editor-project-${nestIndex}-${k}`} className="nested-project-card">
          <div className="project-card-header">
            <strong>プロジェクト実績 #{k + 1}</strong>
            <button
              type="button"
              className="delete-btn-text-sm"
              onClick={() => remove(k)}
            >
              削除
            </button>
          </div>

          <div className="form-group">
            <label>プロジェクト名</label>
            <input
              {...register(`workExperiences.${nestIndex}.projects.${k}.name`)}
              placeholder="ECサイト開発プロジェクト"
            />
          </div>

          <div className="form-grid-2col">
            <div className="form-group">
              <label>開始年月</label>
              <input type="month" {...register(`workExperiences.${nestIndex}.projects.${k}.startDate`)} />
            </div>
            <div className="form-group">
              <label>終了年月</label>
              <input 
                type="month" 
                {...register(`workExperiences.${nestIndex}.projects.${k}.endDate`)} 
                disabled={watch(`workExperiences.${nestIndex}.projects.${k}.isCurrentlyWorking`)}
              />
            </div>
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="checkbox" 
                {...register(`workExperiences.${nestIndex}.projects.${k}.isCurrentlyWorking`)} 
                style={{ width: 'auto' }}
              />
              現在も担当中
            </label>
          </div>

          <div className="form-grid-2col">
            <div className="form-group">
              <label>開発規模</label>
              <input
                {...register(
                  `workExperiences.${nestIndex}.projects.${k}.scale`,
                )}
                placeholder="10名体制、期間1年"
              />
            </div>
            <div className="form-group">
              <label>役職/職種</label>
              <input
                {...register(
                  `workExperiences.${nestIndex}.projects.${k}.assignedTasks`,
                )}
                placeholder="システムエンジニア"
              />
            </div>
          </div>

          <div className="form-group">
            <label>プロジェクト詳細</label>
            <textarea
              {...register(
                `workExperiences.${nestIndex}.projects.${k}.details`,
              )}
              rows={3}
              placeholder="プロジェクトの概要を入力してください。"
            />
          </div>

          <div className="form-group">
            <label>作業内容</label>
            <ListEditor nestIndex={nestIndex} projectIndex={k} control={control} register={register} name="workContent" placeholder="作業内容" />
          </div>

          <div className="form-group">
            <label>担当業務</label>
            <ResponsibilityEditor nestIndex={nestIndex} projectIndex={k} control={control} register={register} />
          </div>

          <div className="star-form-grid">
            <div className="form-group">
              <label>Situation</label>
              <textarea
                {...register(
                  `workExperiences.${nestIndex}.projects.${k}.star.situation`,
                )}
                rows={4}
                placeholder="直面した状況について"
              />
            </div>
            <div className="form-group">
              <label>Task</label>
              <textarea
                {...register(
                  `workExperiences.${nestIndex}.projects.${k}.star.task`,
                )}
                rows={4}
                placeholder="達成すべき目標"
              />
            </div>
            <div className="form-group">
              <label>Action</label>
              <textarea
                {...register(
                  `workExperiences.${nestIndex}.projects.${k}.star.action`,
                )}
                rows={4}
                placeholder="実行したアクション"
              />
            </div>
            <div className="form-group">
              <label>Result</label>
              <textarea
                {...register(
                  `workExperiences.${nestIndex}.projects.${k}.star.result`,
                )}
                rows={4}
                placeholder="得られた成果や結果"
              />
            </div>
          </div>

          <div className="project-tech-stack-form">
            <label className="sub-label">使用技術</label>
            <SkillStackEditor
              path={`workExperiences.${nestIndex}.projects.${k}.techStack`}
              watch={watch}
              setValue={setValue}
            />
          </div>
        </div>
      ))}
      <Button
        variant="dashed"
        className="w-full"
        onClick={() =>
          append({ 
            name: '', 
            details: '', 
            isCurrentlyWorking: false,
            star: { situation: '', task: '', action: '', result: '' } 
          })
        }
      >
        <Plus size={16} /> プロジェクト実績を追加
      </Button>
    </div>
  );
};
