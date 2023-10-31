import React from 'react';
import Link from 'next/link';

const Home: React.FC = () => {
  return (
    <div>
      <header style={{ backgroundColor: 'black', color: 'white', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>筋肉のToDoリストサイト</h1>
        <div>
          <Link href="/login">
            ログイン
          </Link>
          <Link href="/register">
            会員登録
          </Link>
        </div>
      </header>
      <main style={{ textAlign: 'center' }}>
        <h1>マッスルサイクル</h1>
        <Link href="/calendar">
          はじめる
        </Link>
        {/* 他のコンテンツ要素を追加できます */}
      </main>
    </div>
  );
};

export default Home;
