import { useEffect, useRef, useState } from 'react'
type Category = 'All work' | 'Photography' | 'Art direction' | 'Digital'
type Project = { id: string; title: string; category: Exclude<Category, 'All work'>; image: string; alt: string; note: string; colour: string }
const projects: Project[] = [
{id:'01',title:'Quiet structures',category:'Photography',image:'architecture',alt:'Sculptural white architecture framed against the sky',note:'An architectural photography concept exploring light, negative space, and the beauty of everyday structures.',colour:'#c9d3d8'},
{id:'02',title:'Human, after all',category:'Art direction',image:'portrait',alt:'Portrait of a woman in warm natural light',note:'A portrait-led editorial concept celebrating individuality through close framing and an understated visual language.',colour:'#d8bba7'},
{id:'03',title:'Room to breathe',category:'Digital',image:'interior',alt:'Warm contemporary living room with natural materials',note:'A digital direction for a fictional interior studio: a spacious composition, tactile imagery, and a simple path from inspiration to enquiry.',colour:'#cdc0a8'},
{id:'04',title:'Somewhere slower',category:'Photography',image:'coast',alt:'Still water and mountains in a tranquil landscape',note:'A travel editorial concept about slowing down. Landscape imagery becomes a study of scale, atmosphere, and perspective.',colour:'#acc7c1'},
{id:'05',title:'Objects of affection',category:'Art direction',image:'chair',alt:'Minimal chair photographed against a neutral setting',note:'A furniture campaign concept using expressive shapes and a restrained palette to make an everyday object feel exceptional.',colour:'#e4c89f'},
{id:'06',title:'A new angle',category:'Digital',image:'building',alt:'Geometric architectural facade viewed from below',note:'A website direction for a fictional architecture practice, built around clear hierarchy and a distinctive visual point of view.',colour:'#cbd1da'},
]
const categories: Category[] = ['All work','Photography','Art direction','Digital']
export default function App(){
 const [category,setCategory]=useState<Category>('All work')
 const [menu,setMenu]=useState(false)
 const [contactOpen,setContactOpen]=useState(false)
 const [draft,setDraft]=useState('')
 const [copyStatus,setCopyStatus]=useState('')
 const contactName=useRef<HTMLInputElement>(null)
 const contactToggle=useRef<HTMLButtonElement>(null)
 useEffect(()=>{if(contactOpen)contactName.current?.focus()},[contactOpen])
 function prepareEnquiry(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault()
  const data=new FormData(event.currentTarget)
  setDraft(`Name: ${data.get('name')}\nEmail: ${data.get('email')}\nProject: ${data.get('project')}\n\n${data.get('message')}`)
  setCopyStatus('Your enquiry draft is ready. It has not been sent.')
 }
 async function copyEnquiry(){
  try{await navigator.clipboard.writeText(draft);setCopyStatus('Copied. You can paste this enquiry into your preferred messaging app.')}
  catch{setCopyStatus('Select and copy the draft below manually.')}
 }

 const [active,setActive]=useState<Project|null>(null)
 const star=useRef<HTMLSpanElement>(null)
 const starDock=useRef<HTMLSpanElement>(null)
 useEffect(()=>{
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)')
  const fine=window.matchMedia('(pointer: fine)')
  let pointerX=window.innerWidth/2, pointerY=window.innerHeight/2
  let frame=0, x=0, y=0, scale=1, initial=true
  function draw(){
   const icon=star.current, dock=starDock.current
   if(!icon||!dock)return
   if(reduced.matches||!fine.matches){
    icon.removeAttribute('style');initial=true;return
   }
   const box=dock.getBoundingClientRect()
   const size=box.width
   const progress=Math.min(1,Math.max(0,(window.scrollY-100)/200))
   const floatX=48+(window.innerWidth-size-96)*(1-pointerX/window.innerWidth)
   const floatY=Math.max(80,Math.min(window.innerHeight-size-48,window.innerHeight*.46-(pointerY-window.innerHeight/2)*.16))
   const targetX=box.left*(1-progress)+floatX*progress
   const targetY=box.top*(1-progress)+floatY*progress
   const targetScale=1-progress*.35
   if(initial||progress===0){x=targetX;y=targetY;scale=targetScale;initial=false}
   else{x+=(targetX-x)*.09;y+=(targetY-y)*.09;scale+=(targetScale-scale)*.09}
   icon.style.position='fixed';icon.style.left='0';icon.style.top='0'
   icon.style.translate=`${x}px ${y}px`;icon.style.scale=String(scale)
   icon.style.zIndex='50'
   if(Math.abs(targetX-x)+Math.abs(targetY-y)+Math.abs(targetScale-scale)>.15)frame=requestAnimationFrame(draw)
   else frame=0
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(()=>{frame=0;draw()})}
  function move(event:PointerEvent){pointerX=event.clientX;pointerY=event.clientY;schedule()}
  schedule()
  window.addEventListener('scroll',schedule,{passive:true})
  window.addEventListener('pointermove',move,{passive:true})
  window.addEventListener('resize',schedule)
  reduced.addEventListener('change',schedule);fine.addEventListener('change',schedule)
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('pointermove',move);window.removeEventListener('resize',schedule);reduced.removeEventListener('change',schedule);fine.removeEventListener('change',schedule)}
 },[])
 const dialog=useRef<HTMLDialogElement>(null)
 const opener=useRef<HTMLButtonElement|null>(null)
 useEffect(()=>{if(active){dialog.current?.showModal();const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=old}}},[active])
 function close(){dialog.current?.close();setActive(null);opener.current?.focus()}
 function open(project:Project,event:React.MouseEvent<HTMLButtonElement>){opener.current=event.currentTarget;setActive(project)}
 const visible=projects.filter(p=>category==='All work'||p.category===category)
 return <><a className="skip" href="#main">Skip to content</a><header className="nav"><a className="wordmark" href="#">forma<span>®</span></a><p className="nav-note">Independent minds.<br/>Distinctive perspectives.</p><button className="menu-button" aria-expanded={menu} aria-controls="navigation" onClick={()=>setMenu(!menu)}>{menu?'Close':'Menu'} <span aria-hidden="true">{menu?'−':'+'}</span></button><nav id="navigation" className={menu?'open':''} aria-label="Main navigation"><a href="#work" onClick={()=>setMenu(false)}>Work <span>06</span></a><a href="#studio" onClick={()=>setMenu(false)}>Studio</a><a className="contact-link" href="#contact" onClick={()=>setMenu(false)}>Let’s talk ↗</a></nav></header>
 <main id="main"><section className="hero"><div className="hero-top"><span className="hero-location">EST. AS A CONCEPT / 2026</span></div><h1>A different<br/><span className="last-line">point of <em>view.</em><span ref={starDock} className="star-dock" aria-hidden="true"><span ref={star} className="asterisk">✳</span></span></span></h1><div className="hero-bottom"><p>We bring a fresh eye to brands, spaces,<br className="desktop"/> and the stories worth telling.</p><a href="#work" className="round-link"><span>Explore selected work</span><i aria-hidden="true">↓</i></a></div><div className="hero-image"><img src="/images/architecture.jpg" alt="White sculptural architecture with sweeping curves" fetchPriority="high"/><span className="image-tag">01 / THE ART OF SEEING</span><span className="image-note">Look a little closer.</span></div></section>
 <section id="work" className="work"><div className="section-heading"><div><h2>Selected work<span>(06)</span></h2></div><p>Thoughtful ideas.<br/>Unexpected outcomes.</p></div><div className="filters" role="group" aria-label="Filter projects">{categories.map(c=><button key={c} aria-pressed={c===category} onClick={()=>setCategory(c)} className={c===category?'selected':''}>{c}<span>{c==='All work'?'06':'02'}</span></button>)}<span className="filter-note" role="status">{visible.length} concepts / 2026</span></div><div className="project-grid">{visible.map(p=><button className={'project project-'+p.id} key={p.id} onClick={e=>open(p,e)} aria-label={'View '+p.title+' project'}><div className="project-image" style={{background:p.colour}}><img src={'/images/'+p.image+'.jpg'} alt={p.alt} loading="lazy"/><span className="project-index">{p.id}</span><span className="project-arrow" aria-hidden="true">↗</span>{p.id==='03'&&<span className="project-overlay">Room to<br/><em>breathe.</em></span>}{p.id==='06'&&<span className="angle-label">A / NEW<br/>ANGLE</span>}</div><div className="project-meta"><h3>{p.title}</h3><span>{p.category}</span></div></button>)}</div><p className="concept-note">All projects are illustrative concepts. Photography sourced from Unsplash.</p></section>
 <section id="studio" className="studio"><div className="studio-label"><p className="eyebrow">The studio</p><span className="studio-star" aria-hidden="true">✳</span></div><div className="studio-copy"><h2>Good work starts<br/>with <em>curiosity.</em></h2><p>Forma is an independent studio concept at the intersection of photography, art direction, and digital design. We look for the detail others walk past—and turn it into something worth paying attention to.</p><div className="services"><span>01 / Photography</span><span>02 / Art direction</span><span>03 / Digital experiences</span></div></div></section>
 <section className="process"><p className="eyebrow">From a question to a point of view</p><div className="process-grid">{[['01','Look closely','Find the story, understand the context, and ask better questions.'],['02','Make connections','Explore visual directions and turn a promising idea into a clear concept.'],['03','Bring it to life','Shape the details, refine the experience, and make every element feel intentional.']].map(([n,t,d])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div></section>
 <section id="contact" className="contact"><p className="eyebrow">Something on your mind?</p><div className="contact-intro"><h2>Let’s make<br/><em>something</em> matter</h2><button ref={contactToggle} className="contact-toggle" aria-expanded={contactOpen} aria-controls="contact-form-panel" onClick={()=>{setContactOpen(!contactOpen)}}><span aria-hidden="true">{contactOpen?'−':'↗'}</span><span>{contactOpen?'Close contact form':'Open contact form'}</span></button></div>
 <div id="contact-form-panel" hidden={!contactOpen} className="contact-form-panel"><div className="form-heading"><h3>Tell us what you have in mind.</h3><p>Frontend demo: prepare and copy an enquiry. Nothing is sent or stored.</p></div><form onSubmit={prepareEnquiry}><div className="form-row"><label>Your name<input ref={contactName} name="name" autoComplete="name" required maxLength={100} placeholder="How should we call you?"/></label><label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com"/></label></div><label>What are you looking for?<select name="project" defaultValue="Digital design"><option>Digital design</option><option>Photography</option><option>Art direction</option><option>Something else</option></select></label><label>A little about your project<textarea name="message" required minLength={10} maxLength={3000} rows={4} placeholder="Your idea, goals, and any timing you have in mind…"/></label><button className="prepare-button" type="submit">Prepare enquiry <span aria-hidden="true">↗</span></button></form>{draft&&<div className="enquiry-draft"><label>Enquiry draft<textarea readOnly value={draft} rows={6}/></label><button type="button" className="prepare-button" onClick={copyEnquiry}>Copy enquiry</button></div>}<p role="status" className="copy-status">{copyStatus}</p></div>
 <div className="contact-bottom"><p>This is a portfolio concept.<br/>Contact the creator through <a href="https://a-majid-portfolio-mauve.vercel.app/">Abdulmajid’s portfolio ↗</a>.</p><a href="#work">Take another look at the work ↗</a></div></section></main><footer><a className="wordmark" href="#">forma<span>®</span></a><a href="https://a-majid-portfolio-mauve.vercel.app/">Developed by Abdulmajid Abdurrahim.</a><a href="#">Back to top ↑</a><span>Concept studio · 2026</span></footer>
 <dialog ref={dialog} className="project-dialog" onCancel={e=>{e.preventDefault();close()}} onClick={e=>{if(e.target===e.currentTarget)close()}} aria-labelledby="dialog-title">{active&&<><button className="dialog-close" onClick={close} autoFocus aria-label="Close project preview">Close ×</button><img className="dialog-image" src={'/images/'+active.image+'.jpg'} alt={active.alt}/><div className="dialog-copy"><p className="eyebrow">{active.category} / Concept {active.id}</p><h2 id="dialog-title">{active.title}</h2><p>{active.note}</p><div className="dialog-details"><span>Scope<br/><strong>Visual exploration</strong></span><span>Status<br/><strong>Illustrative concept</strong></span></div><p className="dialog-credit">Reference photography: Unsplash. This is a fictional brief, not a commissioned client project.</p></div></>}</dialog></>
}
