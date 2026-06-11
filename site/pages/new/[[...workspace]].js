import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'
import { saveAs } from 'file-saver';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import { useRouter } from 'next/router'
import allworkspaces from '../../../public/list.json'


export async function getStaticPaths() {
  let paths = allworkspaces.workspaces.map(workspace => ({
    params: {
      workspace: [btoa(workspace.friendly_name)]
    }
  }))
  paths.push({
    params: { workspace: null }
  })
  return {
    paths,
    fallback: false, // can also be true or 'blocking'
  }
}

// `getStaticPaths` requires using `getStaticProps`
export async function getStaticProps({ params }) {
  const workspace = params.workspace
  return {
    // Passed to the page component as props
    props: { workspace: workspace ?? null },
  }
}

export default function New({ workspace }) {

  const name = useRef(null);
  const friendly_name = useRef(null);
  const description = useRef(null);

  const [categories, setCategories] = useState(null)
  const [architecture, setArchitecture] = useState(null)
  const [icon, setIcon] = useState(null)
  const [ext, setExt] = useState('png')
  const [inlineImage, setInlineImage] = useState(null)

  const defaultState = {
    friendly_name: null,
    image_src: null,
    description: null,
    cores: 2,
    memory: 2768,
    gpu_count: 0,
    cpu_allocation_method: "Inherit",
    docker_registry: "https://index.docker.io/v1/",
    categories: [],
    require_gpu: false,
    enabled: true,
    image_type: 'Container',
  }

  const [combined, setCombined] = useState(defaultState)

  const router = useRouter()
  // const { workspace } = router.query

  useEffect(() => {
    if(workspace === null) {
      description.current.value = ''
      name.current.value = ''
      friendly_name.current.value = ''
      setCategories(null)
      setArchitecture(null)
      setIcon(null)
      setCombined(defaultState)
    }
    else if (workspace && workspace[0]) {
      const workspaceDetails = allworkspaces.workspaces.find(el => el.friendly_name === atob(workspace[0]))
      delete workspaceDetails['sha']
      description.current.value = workspaceDetails.description
      name.current.value = workspaceDetails.name
      friendly_name.current.value = workspaceDetails.friendly_name
      if (workspaceDetails.categories) {
        let catMap = []
        workspaceDetails.categories.map((e) => catMap.push({
          label: e,
          value: e,
        }))
        setCategories(catMap)
      }
      if (workspaceDetails.architecture) {
        let archMap = []
        workspaceDetails.architecture.map((e) => archMap.push({
          label: e,
          value: e,
        }))
        setArchitecture(archMap)
      }

      setInlineImage(`${router.basePath}/icons/${workspaceDetails.image_src}`)

      setCombined({
        ...combined,
        ...workspaceDetails
      })
    }
  }, [workspace])

  const displayWorkspace = () => {
    return {
      ...combined,
      // categories: JSON.stringify(combined.categories)
    }
  }

  const customStyles = {
    control: (base, state) => ({
      ...base,
      background: "#1E1E24",
      borderRadius: '0.5rem',
      borderColor: state.isFocused ? "#F26B21" : "rgba(255,255,255,0.1)",
      boxShadow: 'none',
      ':hover': { borderColor: 'rgba(255,255,255,0.2)' },
    }),
    menu: (base) => ({ ...base, background: "#16161A", border: '1px solid rgba(255,255,255,0.1)' }),
    option: (base, state) => ({
      ...base,
      background: state.isFocused ? 'rgba(242,107,33,0.18)' : 'transparent',
      color: '#e2e8f0',
      cursor: 'pointer',
    }),
    input: (base) => ({ ...base, color: '#e2e8f0' }),
    singleValue: (base) => ({ ...base, color: '#e2e8f0' }),
    placeholder: (base) => ({ ...base, color: 'rgba(255,255,255,0.3)' }),
    multiValue: (styles) => ({ ...styles, backgroundColor: 'rgba(242,107,33,0.2)' }),
    multiValueLabel: (styles) => ({ ...styles, color: '#FBBF77' }),
    multiValueRemove: (styles) => ({ ...styles, color: '#FBBF77', ':hover': { backgroundColor: 'rgba(232,57,43,0.6)', color: '#fff' } }),
  }

  useEffect(() => {
    if (combined && combined.friendly_name) {
      const updateWorkspace = {
        ...combined
      }
      updateWorkspace.image_src = friendlyUrl(updateWorkspace.friendly_name) + '.' + ext
      setCombined(updateWorkspace)
    }
  }, [ext])

  const updateCategories = (items) => {
    const updateWorkspace = {
      ...combined
    }
    updateWorkspace.categories = items.map(cat => cat.value)
    setCombined(updateWorkspace)
    let catMap = []
    updateWorkspace.categories.map((e) => catMap.push({
      label: e,
      value: e,
    }))
    setCategories(catMap)
  }

  const updateArchitecture = (items) => {
    const updateWorkspace = {
      ...combined
    }
    updateWorkspace.architecture = items.map(arch => arch.value)
    setCombined(updateWorkspace)
    let archMap = []
    updateWorkspace.architecture.map((e) => archMap.push({
      label: e,
      value: e,
    }))
    setArchitecture(archMap)
  }

  function friendlyUrl(url) {
    // make the url lowercase
    var encodedUrl = url.toString().toLowerCase();
    // replace & with and
    encodedUrl = encodedUrl.split(/\&+/).join("-and-")
    // remove invalid characters
    encodedUrl = encodedUrl.split(/[^a-z0-9]/).join("-");
    // remove duplicates
    encodedUrl = encodedUrl.split(/-+/).join("-");
    // trim leading & trailing characters
    encodedUrl = encodedUrl.trim('-');
    return encodedUrl;
  }

  const downloadZip = () => {
    var JSZip = require("jszip");
    const zip = new JSZip()
    const folder = zip.folder(combined.friendly_name)
    folder.file('workspace.json', JSON.stringify(combined, null, 2))
    if (icon) {
      folder.file(combined.image_src, icon.file)
    }
    else if (inlineImage) {
      const promise = fetch(inlineImage).then(response => response.blob())
      folder.file(combined.image_src, promise)
    }
    zip.generateAsync({ type: "blob" })
      .then(function (content) {
        // Force down of the Zip file
        saveAs(content, friendlyUrl(combined.friendly_name) + '.zip');
      });
  }

  const handleChange = (event) => {
    const updateWorkspace = {
      ...combined
    }
    updateWorkspace[event.target.name] = event.target.value
    if (event.target.name === 'icon') {
      delete updateWorkspace.icon
      setIcon({
        value: event.target.value,
        file: event.target.files[0]
      })
      setExt(event.target.value.substr(event.target.value.lastIndexOf('.') + 1))
      setInlineImage(null)
      // return
    }

    if (updateWorkspace.friendly_name) {
      updateWorkspace.image_src = friendlyUrl(updateWorkspace.friendly_name) + '.' + ext
    }

    setCombined(updateWorkspace)
  }

  const options = [
    { value: 'Browser', label: 'Browser' },
    { value: 'Communication', label: 'Communication' },
    { value: 'Desktop', label: 'Desktop' },
    { value: 'Development', label: 'Development' },
    { value: 'Games', label: 'Games' },
    { value: 'Multimedia', label: 'Multimedia' },
    { value: 'Office', label: 'Office' },
    { value: 'Privacy', label: 'Privacy' },
    { value: 'Productivity', label: 'Productivity' },
    { value: 'Remote Access', label: 'Remote Access' }
  ]

  return (
    <div className="">
      <Head>
        <title>{`Add Workspace — ${process.env.name}`}</title>
        <meta name="description" content={`Build a workspace definition for the ${process.env.name} registry`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='flex flex-col lg:flex-row w-full my-20 max-w-6xl text-sm rounded-xl overflow-hidden mx-auto border border-white/10 shadow-fire'>
        <div className='w-full lg:w-1/2 p-16 bg-ink-850'>
          <h1 className='font-display font-black text-2xl mb-2 text-white'>Add Workspace</h1>
          <div className='flex flex-col'>
            <p className='mb-8 text-white/50'>This page is designed to allow admins to generate the JSON they need to upload to the "workspaces" directory. It also allows end users to see what settings are needed if they want to manually copy them into a new workspace.</p>

            <label className='mb-2 font-medium'>Icon</label>
            <input type="file" name="icon" onChange={handleChange} className='mb-2 p-2 rounded-lg bg-ink-800 text-slate-100 border border-solid border-white/10 outline-none focus:border-fire-orange/70' />
            <p className='mb-6 opacity-70'>Select the image to use, image will be renamed when it's downloaded.</p>

            <label className='mb-2 font-medium'>Friendly Name</label>
            <input ref={friendly_name} name="friendly_name" onChange={handleChange} className='mb-2 p-2 rounded-lg bg-ink-800 text-slate-100 border border-solid border-white/10 outline-none focus:border-fire-orange/70' />
            <p className='mb-6 opacity-70'>This is the name that will show for users</p>

            <label className='mb-2 font-medium'>Categories</label>
            <CreatableSelect
              instanceId="1"
              name="categories"
              isMulti
              options={options}
              onChange={updateCategories}
              styles={customStyles}
              value={categories}
            />
            <p className='mb-6 mt-2 opacity-70'>You can select from the available option or create new ones.</p>

            <label className='mb-2 font-medium'>Description</label>
            <input ref={description} name="description" onChange={handleChange} className='mb-2 p-2 rounded-lg bg-ink-800 text-slate-100 border border-solid border-white/10 outline-none focus:border-fire-orange/70' />
            <p className='mb-6 opacity-70'>A short description about the workspace</p>

            <label className='mb-2 font-medium'>Docker Image</label>
            <input ref={name} name="name" onChange={handleChange} className='mb-2 p-2 rounded-lg bg-ink-800 text-slate-100 border border-solid border-white/10 outline-none focus:border-fire-orange/70' />
            <p className='mb-6 text-white/50'>The docker image to use, i.e. <code className='text-xs p-1 px-2 rounded bg-white/10 text-fire-amber'>kasmweb/filezilla:develop</code></p>

            <label className='mb-2 font-medium'>Architecture</label>
            <Select
              instanceId="2"
              name="architecture"
              isMulti
              options={[
                { value: 'amd64', label: 'amd64' },
                { value: 'arm64', label: 'arm64' },
              ]}
              onChange={updateArchitecture}
              styles={customStyles}
              value={architecture}
            />
            <p className='mb-6 mt-2 opacity-70'>You can select from the available option or create new ones.</p>

          </div>
        </div>
        <div className='w-full lg:w-1/2 p-16 bg-ink-900'>
          <Workspace workspace={combined} icon={icon} inlineImage={inlineImage} />
          <pre className='my-8 overflow-y-auto text-xs text-white/70 bg-ink-950/60 rounded-lg p-4 border border-white/10'>{JSON.stringify(displayWorkspace(), null, 2)}</pre>
          <button onClick={downloadZip} className='p-4 relative z-10 px-5 fire-gradient hover:brightness-110 transition shadow-fire m-2 rounded-lg items-center font-semibold text-white flex cursor-pointer'>Download</button>
        </div>
      </div>
    </div>
  )

}


function Workspace({ workspace, icon, inlineImage }) {

  const [showDescription, setShowDescription] = useState(false);

  let srcBlob = null

  if (icon) {
    const blob = new Blob([icon.file])
    srcBlob = URL.createObjectURL(blob);
    workspace.image_src = srcBlob
  }

  const installButton = () => {
    return <button className={"text-xs w-full p-4 py-1 rounded-lg flex justify-center items-center fire-gradient font-bold text-white"}>Install</button>
  }
  const editButton = () => {
    return <div className="text-xs text-color w-full p-4 py-1 rounded-lg bg-white/5 text-white/70 flex justify-center items-center">Edit</div>
  }
  const official = () => {
    return
  }

  const workspaceExists = false

  return (
    <div className={"rounded-xl group w-full shadow max-w-xs relative overflow-hidden h-[100px] border border-solid flex flex-col justify-between bg-ink-800 border-white/10 text-slate-200"}>
      <div className={"absolute top-0 left-0 right-0 h-[200px] transition-all" + (showDescription ? ' -translate-y-1/2' : '')}>
        <div onClick={() => setShowDescription(true)} className={"h-[100px] p-4 relative overflow-hidden cursor-pointer"}>
          <img className="h-[90px] group-hover:scale-150 transition-all absolute left-2 top-1" src={workspace.image_src} onError={(e) => {
            if ( inlineImage !== null) { e.target.src = inlineImage }}} alt={workspace.friendly_name} />
          <div className="flex-col pl-28">
            <div className="font-bold">{workspace.friendly_name || 'Friendly Name'}</div>
            <div className="text-xs mb-2 flex gap-2">{process.env.name || 'Manual'} <span>{official()}</span></div>
            <div className=" h-8"></div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-black/30 h-8 text-[10px] flex items-center justify-center">
            {workspace.architecture && workspace.architecture.map((arch, index) => (
              <span key={'arch' + index} className="p-2 py-0 m-[1px] inline-block rounded bg-white/10">{arch}</span>
            ))}

            {workspace.categories.map((cat, index) => (
              <span key={'cat' + index} className="p-2 py-0 m-[1px] inline-block rounded bg-fire-orange/20 text-fire-amber">{cat}</span>
            ))}
          </div>
          {workspaceExists && workspaceExists.enabled === true && workspaceExists.available === false && (
            <div className="absolute inset-0 flex justify-center items-center bg-slate-600/70 text-white"><i className="fa fa-spinner fa-spin mr-3"></i> Installing</div>
          )}
        </div>
        <div className="h-[100px] text-xs relative p-2 pl-4 flex">
          <button className="absolute right-2 top-2 bg-ink-700 text-white rounded-full flex justify-center items-center h-6 w-6" onClick={() => setShowDescription(false)}>
            <svg style={{ height: '14px', fill: 'currentColor' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z" /></svg>
          </button>
          <div className="flex flex-col flex-grow"><div className="font-bold">{workspace.friendly_name}</div> {workspace.description}</div>
          <div className="flex flex-col justify-end gap-1">
            {editButton()}
            {installButton()}
          </div>
        </div>
      </div>
    </div>
  )
}
