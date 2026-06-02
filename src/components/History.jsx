export default function History({ history }) {
  return (
    <aside className="history card">
      <h2>Log Strategi</h2>
      {history?.length ? (
        <div className="historyList">
          {history.map((item, index) => (
            <div key={`${item.moveNo}-${index}`}>
              <small>#{item.moveNo}</small>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      ) : (
        <p>Belum ada aksi.</p>
      )}
    </aside>
  );
}
