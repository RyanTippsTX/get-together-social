export function AppLoadingSplash() {
  return (
    <div className="bg-pink-lemonade fixed top-0 left-0 z-50 grid h-full w-full place-items-center bg-opacity-80">
      <AppLoadingIndicator />
    </div>
  );
}
export function AppLoadingIndicator() {
  return (
    <div className="grid min-h-full w-full place-items-center ">
      <div className="flex h-40 flex-col items-center justify-center">
        <div className="animate-ping text-center leading-snug">
          <div className="text-[8rem]">🥳</div>
          {/* <div className="text-zin text-5xl font-semibold">Loading...</div> */}
        </div>
      </div>
    </div>
  );
}
