import DataGridDemo from "./DataGridDemo";

function App() {
  const onMessageListener = (e: any) => {
    console.log("Content script 收到消息:", e.detail);
  };
  useEffect(() => {
    window.addEventListener("FROM_INJECTED", onMessageListener, false);
    return () => {
      window.removeEventListener("FROM_INJECTED", onMessageListener);
    };
  }, []);
  return (
    <div>
      <DataGridDemo />
    </div>
  );
}

export default App;
