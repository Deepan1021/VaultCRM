"use client";

import { useMemo, useState } from "react";

const STAGES = ["New", "Contacted", "Qualified", "Proposal Sent", "Closed-Won", "Closed-Lost"];

const seedLeads = [
  { id: 1, name: "Arun Kumar", company: "Nova Retail", email: "arun@novaretail.com", phone: "+91 98765 43210", value: 18000, stage: "New", owner: "Deepan", created: "12 Aug 2026" },
  { id: 2, name: "Priya Shah", company: "Bright Labs", email: "priya@brightlabs.com", phone: "+91 98450 11223", value: 32000, stage: "Qualified", owner: "Deepan", created: "11 Aug 2026" },
  { id: 3, name: "Rahul Menon", company: "Orbit Systems", email: "rahul@orbitsystems.com", phone: "+91 99876 54321", value: 45000, stage: "Proposal Sent", owner: "Karthik", created: "10 Aug 2026" },
  { id: 4, name: "Meera Nair", company: "Urban Foods", email: "meera@urbanfoods.com", phone: "+91 98989 12121", value: 26000, stage: "Contacted", owner: "Karthik", created: "09 Aug 2026" },
  { id: 5, name: "Vikram Rao", company: "Apex Media", email: "vikram@apexmedia.com", phone: "+91 97777 11122", value: 51000, stage: "Closed-Won", owner: "Deepan", created: "08 Aug 2026" },
  { id: 6, name: "Ananya Iyer", company: "PixelWorks", email: "ananya@pixelworks.com", phone: "+91 96666 22233", value: 22000, stage: "New", owner: "Deepan", created: "07 Aug 2026" }
];

const seedCustomers = [
  { id: 1, company: "Nova Retail", contact: "Arun Kumar", email: "arun@novaretail.com", phone: "+91 98765 43210", status: "Active" },
  { id: 2, company: "Bright Labs", contact: "Priya Shah", email: "priya@brightlabs.com", phone: "+91 98450 11223", status: "Active" },
  { id: 3, company: "Orbit Systems", contact: "Rahul Menon", email: "rahul@orbitsystems.com", phone: "+91 99876 54321", status: "Prospect" },
  { id: 4, company: "Apex Media", contact: "Vikram Rao", email: "vikram@apexmedia.com", phone: "+91 97777 11122", status: "Active" }
];

const seedActivities = [
  { id: 1, type: "Proposal sent", subject: "Orbit Systems", detail: "Sales proposal shared with client", time: "10 min ago" },
  { id: 2, type: "Lead qualified", subject: "Bright Labs", detail: "Lead moved to Qualified stage", time: "1 hour ago" },
  { id: 3, type: "Follow-up call", subject: "Nova Retail", detail: "Follow-up call completed", time: "2 hours ago" },
  { id: 4, type: "Customer added", subject: "Apex Media", detail: "Customer profile created", time: "Yesterday" }
];

function money(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}

function Stat({ label, value, icon }) {
  return <div className="stat card">
    <div className="statIcon">{icon}</div>
    <div><div className="statLabel">{label}</div><div className="statValue">{value}</div></div>
  </div>;
}

function Empty({ text }) {
  return <div className="empty">{text}</div>;
}

export default function Home() {
  const [page, setPage] = useState("Dashboard");
  const [role, setRole] = useState("Admin");
  const [leads, setLeads] = useState(seedLeads);
  const [customers, setCustomers] = useState(seedCustomers);
  const [activities, setActivities] = useState(seedActivities);
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [showLead, setShowLead] = useState(false);
  const [showCustomer, setShowCustomer] = useState(false);
  const [toast, setToast] = useState("");
  const [leadForm, setLeadForm] = useState({ name:"", company:"", email:"", phone:"", value:"", stage:"New" });
  const [customerForm, setCustomerForm] = useState({ company:"", contact:"", email:"", phone:"", status:"Prospect" });

  const stats = useMemo(() => {
    const active = leads.filter(l => !["Closed-Won","Closed-Lost"].includes(l.stage));
    return {
      total: leads.length,
      qualified: leads.filter(l => l.stage === "Qualified").length,
      won: leads.filter(l => l.stage === "Closed-Won").length,
      pipeline: active.reduce((sum,l)=>sum + Number(l.value),0),
      conversion: leads.length ? Math.round((leads.filter(l=>l.stage==="Closed-Won").length/leads.length)*100) : 0
    };
  }, [leads]);

  const filteredLeads = leads.filter(l => {
    const q = query.toLowerCase();
    const matchesQ = [l.name,l.company,l.email,l.stage,l.owner].join(" ").toLowerCase().includes(q);
    const matchesStage = stageFilter === "All" || l.stage === stageFilter;
    return matchesQ && matchesStage;
  });

  function notify(message) {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  }

  function addLead(e) {
    e.preventDefault();
    const lead = {
      id: Date.now(),
      ...leadForm,
      value: Number(leadForm.value || 0),
      owner: role === "Admin" ? "Deepan" : "Karthik",
      created: "Today"
    };
    setLeads(prev => [lead, ...prev]);
    setActivities(prev => [{id:Date.now()+1,type:"Lead created",subject:lead.company,detail:`New lead added by ${lead.owner}`,time:"Just now"},...prev]);
    setLeadForm({name:"",company:"",email:"",phone:"",value:"",stage:"New"});
    setShowLead(false);
    notify("Lead created successfully");
  }

  function addCustomer(e) {
    e.preventDefault();
    const customer = { id:Date.now(), ...customerForm };
    setCustomers(prev => [customer,...prev]);
    setActivities(prev => [{id:Date.now()+2,type:"Customer added",subject:customer.company,detail:"Customer profile created",time:"Just now"},...prev]);
    setCustomerForm({company:"",contact:"",email:"",phone:"",status:"Prospect"});
    setShowCustomer(false);
    notify("Customer added successfully");
  }

  function updateStage(id, stage) {
    setLeads(prev => prev.map(l => l.id === id ? {...l,stage} : l));
    const lead = leads.find(l=>l.id===id);
    if (lead) setActivities(prev => [{id:Date.now(),type:"Stage updated",subject:lead.company,detail:`Moved from ${lead.stage} to ${stage}`,time:"Just now"},...prev]);
    notify("Lead stage updated");
  }

  function renderDashboard() {
    return <>
      <PageHead title="Sales Dashboard" sub="Overview of leads, customers and sales activity." action="+ Add Lead" onAction={()=>setShowLead(true)}/>
      <div className="stats">
        <Stat label="Total Leads" value={stats.total} icon="◎"/>
        <Stat label="Qualified Leads" value={stats.qualified} icon="◇"/>
        <Stat label="Closed Won" value={stats.won} icon="✓"/>
        <Stat label="Active Pipeline" value={money(stats.pipeline)} icon="₹"/>
      </div>

      <div className="grid2">
        <section className="card">
          <CardHead title="Sales Pipeline" sub="Current deals"/>
          <div className="pipeline">
            {STAGES.slice(0,5).map(s => <div className="pipe" key={s}><strong>{leads.filter(l=>l.stage===s).length}</strong><span>{s}</span></div>)}
          </div>
        </section>
        <section className="card">
          <CardHead title="Conversion Rate" sub="Lead performance"/>
          <div className="conversion"><div className="ring"><b>{stats.conversion}%</b></div><div><strong>Lead to Win</strong><p>Current closed-won conversion</p></div></div>
        </section>
      </div>

      <section className="card">
        <CardHead title="Top Opportunities" sub="Highest deal values" link="View Leads" onLink={()=>setPage("Leads")}/>
        <LeadTable rows={leads.slice().sort((a,b)=>b.value-a.value).slice(0,5)} onStage={updateStage}/>
      </section>
    </>;
  }

  function renderLeads() {
    return <>
      <PageHead title="Lead Management" sub="Track prospects and move them through the sales pipeline." action="+ Add Lead" onAction={()=>setShowLead(true)}/>
      <div className="filters"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search name, company or email..."/>
        <select value={stageFilter} onChange={e=>setStageFilter(e.target.value)}><option>All</option>{STAGES.map(s=><option key={s}>{s}</option>)}</select>
      </div>
      <section className="card"><LeadTable rows={filteredLeads} onStage={updateStage}/>{!filteredLeads.length && <Empty text="No leads match the selected filters."/>}</section>
    </>;
  }

  function renderCustomers() {
    const filtered = customers.filter(c=>[c.company,c.contact,c.email,c.status].join(" ").toLowerCase().includes(query.toLowerCase()));
    return <>
      <PageHead title="Customers" sub="Centralized customer records and contact information." action="+ Add Customer" onAction={()=>setShowCustomer(true)}/>
      <div className="filters"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search customers..."/></div>
      <section className="card"><table><thead><tr><th>Company</th><th>Contact</th><th>Email</th><th>Phone</th><th>Status</th></tr></thead><tbody>
        {filtered.map(c=><tr key={c.id}><td><b>{c.company}</b></td><td>{c.contact}</td><td>{c.email}</td><td>{c.phone}</td><td><span className={"badge "+c.status.toLowerCase()}>{c.status}</span></td></tr>)}
      </tbody></table>{!filtered.length&&<Empty text="No customers found."/>}</section>
    </>;
  }

  function renderActivities() {
    return <>
      <PageHead title="Activity Logs" sub="Customer communication and sales activity history."/>
      <section className="card activityList">{activities.map(a=><div className="activity" key={a.id}><div className="activityIcon">•</div><div><b>{a.type}</b><div className="activitySubject">{a.subject}</div><p>{a.detail}</p></div><time>{a.time}</time></div>)}</section>
    </>;
  }

  function renderUsers() {
    return <>
      <PageHead title="Users & Roles" sub="Role-based access control for CRM users."/>
      <section className="card"><table><thead><tr><th>User</th><th>Email</th><th>Role</th><th>Access</th></tr></thead><tbody>
        <tr><td><b>Deepan S A</b></td><td>deepan@example.com</td><td><span className="role admin">Admin</span></td><td>Full CRM access</td></tr>
        <tr><td><b>Karthik R</b></td><td>karthik@example.com</td><td><span className="role sales">Sales</span></td><td>Assigned leads and activities</td></tr>
      </tbody></table></section>
      <div className="notice">Demo RBAC is enabled. Use the role selector in the top bar to demonstrate different access levels.</div>
    </>;
  }

  const nav = [
    ["Dashboard","⌂"],["Leads","◈"],["Customers","♙"],["Activities","◷"]
  ];

  return <div className="app">
    <aside className="sidebar">
      <div className="brand"><div className="logo">LP</div><div><strong>LeadPulse</strong><small>ENTERPRISE CRM</small></div></div>
      <nav>{nav.map(([name,icon])=><button key={name} className={"nav "+(page===name?"active":"")} onClick={()=>{setPage(name);setQuery("");}}><span>{icon}</span>{name}</button>)}
      {role==="Admin"&&<button className={"nav "+(page==="Users"?"active":"")} onClick={()=>setPage("Users")}><span>⚙</span>Users & Roles</button>}</nav>
      <div className="sidebarBottom"><div className="secure">✓ Secure workspace<br/><small>Role-based access enabled</small></div><div className="profile"><div className="avatar">DS</div><div><b>Deepan S A</b><small>{role}</small></div></div></div>
    </aside>

    <main className="main">
      <header className="topbar"><div className="crumb">Workspace <span>/</span> <b>{page}</b></div><div className="topRight"><select value={role} onChange={e=>setRole(e.target.value)}><option>Admin</option><option>Sales</option></select><div className="bell">♢</div></div></header>
      <div className="content">
        {page==="Dashboard"&&renderDashboard()}
        {page==="Leads"&&renderLeads()}
        {page==="Customers"&&renderCustomers()}
        {page==="Activities"&&renderActivities()}
        {page==="Users"&&renderUsers()}
      </div>
    </main>

    {showLead&&<Modal title="Add New Lead" close={()=>setShowLead(false)}>
      <form onSubmit={addLead} className="form">
        <Field label="Contact Name" value={leadForm.name} onChange={v=>setLeadForm({...leadForm,name:v})} required/>
        <Field label="Company" value={leadForm.company} onChange={v=>setLeadForm({...leadForm,company:v})} required/>
        <Field label="Email" type="email" value={leadForm.email} onChange={v=>setLeadForm({...leadForm,email:v})}/>
        <Field label="Phone" value={leadForm.phone} onChange={v=>setLeadForm({...leadForm,phone:v})}/>
        <Field label="Deal Value" type="number" value={leadForm.value} onChange={v=>setLeadForm({...leadForm,value:v})}/>
        <label>Stage<select value={leadForm.stage} onChange={e=>setLeadForm({...leadForm,stage:e.target.value})}>{STAGES.map(s=><option key={s}>{s}</option>)}</select></label>
        <button className="primary full">Create Lead</button>
      </form>
    </Modal>}

    {showCustomer&&<Modal title="Add Customer" close={()=>setShowCustomer(false)}>
      <form onSubmit={addCustomer} className="form">
        <Field label="Company" value={customerForm.company} onChange={v=>setCustomerForm({...customerForm,company:v})} required/>
        <Field label="Contact Name" value={customerForm.contact} onChange={v=>setCustomerForm({...customerForm,contact:v})} required/>
        <Field label="Email" type="email" value={customerForm.email} onChange={v=>setCustomerForm({...customerForm,email:v})}/>
        <Field label="Phone" value={customerForm.phone} onChange={v=>setCustomerForm({...customerForm,phone:v})}/>
        <label>Status<select value={customerForm.status} onChange={e=>setCustomerForm({...customerForm,status:e.target.value})}><option>Prospect</option><option>Active</option></select></label>
        <button className="primary full">Create Customer</button>
      </form>
    </Modal>}

    {toast&&<div className="toast">✓ {toast}</div>}
  </div>;
}

function PageHead({title,sub,action,onAction}) {
  return <div className="pageHead"><div><h1>{title}</h1><p>{sub}</p></div>{action&&<button className="primary" onClick={onAction}>{action}</button>}</div>;
}
function CardHead({title,sub,link,onLink}) {
  return <div className="cardHead"><div><h2>{title}</h2><span>{sub}</span></div>{link&&<button className="link" onClick={onLink}>{link}</button>}</div>;
}
function Field({label,value,onChange,type="text",required=false}) {
  return <label>{label}<input type={type} value={value} required={required} onChange={e=>onChange(e.target.value)}/></label>;
}
function Modal({title,close,children}) {
  return <div className="backdrop"><div className="modal"><div className="modalHead"><h2>{title}</h2><button type="button" onClick={close}>×</button></div>{children}</div></div>;
}
function LeadTable({rows,onStage}) {
  return <table><thead><tr><th>Lead</th><th>Company</th><th>Value</th><th>Stage</th><th>Owner</th></tr></thead><tbody>
    {rows.map(l=><tr key={l.id}><td><b>{l.name}</b><small>{l.email}</small></td><td>{l.company}</td><td><b>{money(l.value)}</b></td><td><select className="stage" value={l.stage} onChange={e=>onStage(l.id,e.target.value)}>{STAGES.map(s=><option key={s}>{s}</option>)}</select></td><td>{l.owner}</td></tr>)}
  </tbody></table>;
}
