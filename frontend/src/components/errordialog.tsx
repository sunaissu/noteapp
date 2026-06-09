import React from "react";

interface Props {
  stat: boolean;
  err: string;
}

const ErrorDialog: React.FC<Props> = ({ stat, err }: Props) => {
  const [errDialog, setErrDialog] = React.useState<boolean>(stat);
  return (
    <div>
      {errDialog ? (
        <div className="fixed flex justify-center items-center overflow-x-hidden overflow-y-auto w-full h-full inset-0 z-100">
          <div className="bg-slate-800  w-[30%] h-[25vh] flex justify-center relative overflow-hidden">
            <div className="text-white font-semibold flex items-center h-[15vh]">
              Are you sure you want to delete note?
            </div>
            <button
              className="bg-red px-7 py-2 m-3 font-semibold "
              onClick={() => setErrDialog(false)}
            >
              {err}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ErrorDialog;
