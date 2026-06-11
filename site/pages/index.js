import { useState, useEffect, useMemo } from 'react'
import Head from 'next/head'
import Workspace from '../components/Workspace'
import styles from '../styles/Home.module.css'

export default function Home({ searchText }) {
  const [workspaces, setWorkspaces] = useState(null)
  const [versions, setVersions] = useState(null)
  const [version, setVersion] = useState(null)

  useEffect(() => {
    let currentVersion = localStorage.getItem("version") || null
    fetch('list.json')
      .then((res) => res.json())
      .then((workspaces) => {
        let wsversions = []
        workspaces.workspaces.forEach((workspace) => {
          if(workspace.compatibility) {
            workspace.compatibility.forEach((v) => {
              const value = parseFloat(v.version)
              if(wsversions.indexOf(value) === -1) {
                wsversions.push(value)
              }
            })
          }
        })
        const sorted = wsversions.sort((a,b) => a-b).reverse()

        setVersions(sorted)
        if (currentVersion === null) {
          currentVersion = sorted[0]
          localStorage.setItem("version", currentVersion);
        }
        setVersion(currentVersion)
        setWorkspaces(workspaces)
      })
  }, [])

  const updateVersion = (version) => {
    localStorage.setItem("version", version);
    setVersion(version)
  }

  const filteredWorkspaces = useMemo(() => {
    if (!workspaces?.workspaces || !version) return [];

    const cleanSearchTerm = searchText?.toLowerCase().trim();

    return workspaces.workspaces.filter((workspace) => {
      // Filter by version compatibility
      const isCompatible = workspace.compatibility?.some(
        (el) => el.version.split('.', 2).join('.') === version.toString()
      );

      if (!isCompatible) return false;
      if (!cleanSearchTerm) return true;

      // Filter by search term
      const workspaceName = (workspace.name || workspace.friendly_name).toLowerCase();
      const matchesName = workspaceName.includes(cleanSearchTerm);
      const matchesCategory = workspace.categories?.some(
        (category) => category.toLowerCase().includes(cleanSearchTerm)
      );

      return matchesName || matchesCategory;
    });
  }, [workspaces, version, searchText]);

  return (
    <div className="">
      <Head>
        <title>{`${process.env.name} — Workspaces Registry`}</title>
        <meta name="description" content={`${process.env.name} registry of workspaces for Kasm Workspaces`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <main className="p-8 py-10 xl:px-20">
        <h1 className='flex flex-wrap-reverse uppercase tracking-widest justify-center mb-10 gap-5'>
        <span className='flex items-center text-lg bg-ink-800 border border-white/10 rounded-lg overflow-hidden shadow'>
            <span className='flex px-3 text-xs font-semibold text-white/60'>Workspaces</span>
            <span className='text-white font-bold p-3 py-1 flex fire-gradient'>{workspaces && workspaces.workspacecount}</span>
          </span>
          <span className='flex items-center text-lg bg-ink-800 border border-white/10 rounded-lg overflow-hidden shadow'>
            <span className='flex px-3 text-xs font-semibold text-white/60'>Kasm Version</span>
            <span className='text-white gap-3 p-3 py-1 flex items-center fire-gradient'>{versions && versions.map((v) => (
              <div className={'cursor-pointer transition ' + (+v === +version ? 'text-white font-bold' : 'text-white/60 text-xs hover:text-white')} key={v} onClick={() => updateVersion(v)}>{v}</div>
            ))}</span>
          </span>
        </h1>
        <div className="flex flex-wrap gap-1 justify-center">
          {filteredWorkspaces.length > 0 ? (
            filteredWorkspaces.map((workspace) => (
              <Workspace key={workspace.sha} workspace={workspace} />
            ))
          ) : (
            <p>No workspaces found{searchText && ` matching "${searchText}"`}</p>
          )}
        </div>

        <div className={styles.grid}></div>
      </main>
    </div >
  )
}
