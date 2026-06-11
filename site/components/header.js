import Triangles from '../components/Triangles'
import Link from 'next/link'
import { useRouter } from "next/router";
import { NotificationManager } from 'react-notifications';

export default function Header({ searchText, changeSearch }) {

  const copyToClipboard = () => {
    var textField = document.createElement('textarea')
    textField.innerText = listUrl
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
    NotificationManager.info('URL successfully copied to clipboard', 'Copy URL', 4000);
  }
  const listUrl = process.env.listUrl;
  const router = useRouter();
  const getLink = (path) => `${router.basePath}${path}`;

  return (
    <header className="relative overflow-hidden border-b border-white/10 bg-ink-900 p-8 xl:px-32 text-white gap-5 md:gap-0 flex flex-wrap justify-center items-center">
      <div className="absolute inset-x-0 top-0 h-1 fire-gradient" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[680px] -translate-x-1/2 rounded-full bg-fire-orange/20 blur-3xl" />
      <Triangles />
      <div className='relative z-10 flex items-center gap-4'>
        <img src={getLink('/img/blackfire-mark.png')} alt={process.env.name} className="h-14 w-14 shrink-0 object-contain drop-shadow-[0_4px_14px_rgba(242,107,33,0.45)]" />
        <div>
          <div className="font-display font-black text-3xl leading-none tracking-tight">{process.env.name}</div>
          <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.32em] fire-text">Workspaces Registry</div>
        </div>
      </div>
      <nav className='relative z-10 mx-12 flex gap-1'>
        <a href={getLink("/")} className={'px-5 py-2.5 inline-block rounded-full text-sm font-medium transition border border-solid' + (router.pathname == "/" ? ' fire-gradient border-transparent text-white shadow-fire' : ' border-white/10 text-white/70 hover:text-white hover:border-white/30')}>Library</a>
        <Link href="/new/" className={'px-5 py-2.5 inline-block rounded-full text-sm font-medium transition border border-solid' + (router.pathname.startsWith("/new") ? ' fire-gradient border-transparent text-white shadow-fire' : ' border-white/10 text-white/70 hover:text-white hover:border-white/30')}>New</Link>
      </nav>
      <div className="grow flex justify-center relative z-10">
        <div className='bg-ink-950/70 border border-white/10 rounded-lg flex w-full max-w-md focus-within:border-fire-orange/70 transition'>
          <input
            name="search"
            className='bg-transparent text-base w-full p-4 outline-none placeholder:text-white/30'
            placeholder='Search for workspace'
            type="text"
            value={searchText}
            onChange={changeSearch}
          />

        </div>

      </div>
      <button className='p-4 relative z-10 px-5 fire-gradient hover:brightness-110 transition shadow-fire m-2 rounded-lg items-center font-semibold text-white flex cursor-pointer' onClick={() => { copyToClipboard() }}>
        <span className="mr-3">Workspace Registry Link</span>
        <svg style={{ height: '14px', fill: '#fff' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M224 0c-35.3 0-64 28.7-64 64V288c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H224zM64 160c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H288c35.3 0 64-28.7 64-64V384H288v64H64V224h64V160H64z" /></svg>
      </button>
    </header >

  )
}