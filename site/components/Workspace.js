import { useRouter } from 'next/router'

function Workspace({ Component, pageProps, workspace }) {
    const router = useRouter()

    const viewexample = (workspace) => {
        router.push({
            pathname: '/new/[workspace]',
            query: { workspace: btoa(workspace.friendly_name)}
        })
    }

    return (
        <div onClick={() => viewexample(workspace)} className="w-[245px] h-[88px] transition-all relative cursor-pointer group flex p-2 items-center justify-center bg-ink-800 border border-white/10 shadow rounded-lg hover:-translate-y-0.5 hover:border-fire-orange/50 hover:shadow-fire">
            <div className="w-full h-full relative z-10">
                <div className="show-grid flex h-full items-center">
                    <div className="kasmcard-img flex h-full mx-4 items-center justify-center">
                        <img className="w-[50px] max-h-[66px]" src={`${router.basePath}/icons/${workspace.image_src}`} />
                    </div>
                    <div className="kasmcard-detail settingPad">
                        <h5 className="text-base font-semibold text-white">{ workspace.friendly_name }</h5>
                        <p className="text-xs font-medium uppercase tracking-wider text-fire-amber/80">{ workspace.categories && workspace.categories[0] || 'Unknown' }</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Workspace
