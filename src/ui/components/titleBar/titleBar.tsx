import { MouseEventHandler } from "react";

function TitleBar() {
  function titlebarAction(
    action: number
  ): MouseEventHandler<HTMLDivElement> | undefined {
    return () => {
      switch (action) {
        case 1:
          window.electronApp.minimizebtn();
          break;
        case 2:
          window.electronApp.maximizebtn();
          break;
        case 3:
          window.electronApp.closebtn();
          break;
      }
    };
  }
  return (
    <div className="titlebar flex items-center bg-gray-200 h-8 px-3 border-b border-gray-300">
      <div className="window-controls flex space-x-2">
        <div
          onClick={titlebarAction(3)}
          className="w-3 h-3 bg-red-500 rounded-full hover:brightness-90"
        ></div>
        <div
          onClick={titlebarAction(2)}
          className="w-3 h-3 bg-yellow-500 rounded-full hover:brightness-90"
        ></div>
        <div
          onClick={titlebarAction(1)}
          className="w-3 h-3 bg-green-500 rounded-full hover:brightness-90"
        ></div>
      </div>
      <div className="flex-1 flex justify-center">
        <div className="title text-sm text-gray-600 font-semibold font-mono select-none -webkit-app-region: no-drag;">
          TruckFlow
        </div>
      </div>
    </div>
  );
}
export default TitleBar;
