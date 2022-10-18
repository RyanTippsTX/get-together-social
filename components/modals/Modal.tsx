export function Modal({
  isOpen,
  closeModal,
  children,
}: {
  isOpen: boolean;
  closeModal: Function;
  children?: React.ReactNode | React.ReactNode[];
}) {
  if (!isOpen) return <></>;

  return (
    // splash
    <div
      className="bg-pink-lemonade fixed top-0 left-0 z-50 grid h-full w-full place-items-center bg-opacity-80"
      onClick={(e) => {
        e.stopPropagation();
        // console.log('clicked splash');
        closeModal();
      }}
    >
      {/* card */}
      <div
        className="card bg-base-100 w-96 shadow-lg"
        onClick={(e) => {
          e.stopPropagation();
          // console.log('clicked card');
        }}
      >
        {children}
      </div>
    </div>
  );
}
