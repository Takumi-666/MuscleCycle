// Profile.tsx
import React from 'react';
import Link from 'next/link';

interface ProfileProps {
  username: string;
  achievements: number;
  iconUrl: string;
}

const Profile: React.FC<ProfileProps> = ({ username, achievements, iconUrl }) => {
  return (
    <div>
      <header style={{ backgroundColor: 'black', color: 'white', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>マイページ</h1>
        <div>
          <div>
            <Link href="/calendar">
              カレンダー
            </Link>
          </div>
        </div>
      </header>
      <main>
        {/* プロフィール情報を表示 */}
        <p>ユーザー名: {username}</p>
        <p>目標達成数: {achievements}</p>
        <img src={iconUrl} alt="アイコン" />
      </main>
    </div>
  );
};

export default Profile;
