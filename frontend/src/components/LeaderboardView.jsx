import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Trophy, 
  Award, 
  Crown, 
  Medal,
  Zap,
  Star
} from 'lucide-react';

export default function LeaderboardView() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [lbRes, statsRes] = await Promise.all([
        api.get('/analytics/leaderboard'),
        api.get('/analytics/dashboard')
      ]);
      setLeaderboard(lbRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-label-sm font-bold uppercase tracking-wider backdrop-blur-md flex items-center space-x-1.5 w-max border border-white/30">
              <Crown className="w-4 h-4 text-amber-200 fill-current" />
              <span>Gamification & Innovation Hall of Fame</span>
            </span>
            <h1 className="font-headline-xl text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Bảng Xếp Hạng Đổi Mới & Vinh Danh LeadsGen
            </h1>
            <p className="font-body-md text-white/90 text-sm max-w-xl leading-relaxed">
              Tuyên dương các cá nhân & phòng ban xuất sắc nhất có nhiều sáng kiến áp dụng thành công vào thực tế.
            </p>
          </div>

          {stats && (
            <div className="bg-white/15 border border-white/30 backdrop-blur-md rounded-2xl p-5 text-right shrink-0 shadow-sm">
              <span className="text-xs font-label-sm font-bold text-amber-100 uppercase tracking-wider block">Tổng chi phí tiết kiệm</span>
              <span className="font-mono-metric text-2xl font-black text-white mt-1 block">
                {(stats.totalImplementedSavings || 0).toLocaleString('vi-VN')} VNĐ
              </span>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400 font-label-md">Đang tải bảng vinh danh...</div>
      ) : (
        <>
          {/* Top 3 Champions Podium */}
          {leaderboard.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-6">
              {/* Silver - Rank 2 */}
              {top2 && (
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md text-center order-2 md:order-1 relative overflow-hidden hover:shadow-xl transition-all">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-slate-100 rounded-bl-full flex items-start justify-end p-3">
                    <span className="font-black text-sm text-slate-400">#2</span>
                  </div>
                  <div className="relative inline-block mb-3">
                    <img
                      src={top2.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Silver'}
                      alt="Top 2"
                      className="w-20 h-20 rounded-full border-4 border-slate-300 mx-auto shadow-md object-cover"
                    />
                    <Medal className="w-7 h-7 text-slate-400 absolute -bottom-1 -right-1 fill-current bg-white rounded-full p-0.5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-label-sm font-bold text-[10px] uppercase tracking-wider">
                    Á QUÂN SÁNG TẠO
                  </span>
                  <h3 className="font-headline-sm text-base font-bold text-slate-900 mt-1">{top2.fullName}</h3>
                  <p className="text-xs text-slate-500 font-medium">{top2.department}</p>
                  <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Đã Áp Dụng</span>
                      <span className="text-sm font-bold text-slate-800">{top2.implementedIdeas}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Điểm INNO</span>
                      <span className="font-mono-metric text-sm font-bold text-orange-600">{top2.totalScore} pts</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Gold - Rank 1 */}
              {top1 && (
                <div className="bg-gradient-to-b from-amber-50 to-white rounded-3xl p-8 border-2 border-amber-400 shadow-xl text-center order-1 md:order-2 relative overflow-hidden scale-105">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/20 rounded-bl-full flex items-start justify-end p-4">
                    <Crown className="w-7 h-7 text-amber-600 fill-current" />
                  </div>
                  <div className="relative inline-block mb-4">
                    <img
                      src={top1.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gold'}
                      alt="Top 1"
                      className="w-24 h-24 rounded-full border-4 border-amber-400 mx-auto shadow-xl ring-4 ring-amber-300/40 object-cover"
                    />
                    <Trophy className="w-9 h-9 text-amber-500 absolute -bottom-1 -right-1 fill-current bg-white rounded-full p-1 shadow-md" />
                  </div>
                  <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-amber-950 font-label-sm font-extrabold text-[11px] uppercase tracking-wider shadow-xs">
                    🏆 QUÁN QUÂN INNOVATION
                  </span>
                  <h3 className="font-headline-md text-xl font-bold text-slate-900 mt-2">{top1.fullName}</h3>
                  <p className="text-xs text-amber-800 font-bold">{top1.department}</p>
                  <div className="mt-5 pt-4 border-t border-amber-200/80 grid grid-cols-2 gap-2 text-center">
                    <div>
                      <span className="text-[10px] text-amber-700 font-bold uppercase block">Ý Tưởng Áp Dụng</span>
                      <span className="text-base font-bold text-slate-900">{top1.implementedIdeas}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-700 font-bold uppercase block">Điểm Tích Lũy</span>
                      <span className="font-mono-metric text-base font-bold text-orange-600">{top1.totalScore} pts</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Bronze - Rank 3 */}
              {top3 && (
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md text-center order-3 relative overflow-hidden hover:shadow-xl transition-all">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-amber-50 rounded-bl-full flex items-start justify-end p-3">
                    <span className="font-black text-sm text-amber-700">#3</span>
                  </div>
                  <div className="relative inline-block mb-3">
                    <img
                      src={top3.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bronze'}
                      alt="Top 3"
                      className="w-20 h-20 rounded-full border-4 border-amber-600/40 mx-auto shadow-md object-cover"
                    />
                    <Award className="w-7 h-7 text-amber-700 absolute -bottom-1 -right-1 fill-current bg-white rounded-full p-0.5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-label-sm font-bold text-[10px] uppercase tracking-wider">
                    QUÝ QUÂN SÁNG TẠO
                  </span>
                  <h3 className="font-headline-sm text-base font-bold text-slate-900 mt-1">{top3.fullName}</h3>
                  <p className="text-xs text-slate-500 font-medium">{top3.department}</p>
                  <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Đã Áp Dụng</span>
                      <span className="text-sm font-bold text-slate-800">{top3.implementedIdeas}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Điểm INNO</span>
                      <span className="font-mono-metric text-sm font-bold text-orange-600">{top3.totalScore} pts</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Full Leaderboard Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h2 className="font-headline-md text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Zap className="w-5 h-5 text-orange-500 fill-current" />
              <span>Bảng Vinh Danh Chi Tiết Toàn Doanh Nghiệp</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-label-sm font-bold uppercase text-[10px]">
                    <th className="py-3.5 px-4">Hạng</th>
                    <th className="py-3.5 px-4">Thành Viên</th>
                    <th className="py-3.5 px-4">Phòng Ban</th>
                    <th className="py-3.5 px-4 text-center">Đã Gửi</th>
                    <th className="py-3.5 px-4 text-center">Đã Áp Dụng</th>
                    <th className="py-3.5 px-4 text-right">Tổng Tiết Kiệm (VNĐ)</th>
                    <th className="py-3.5 px-4 text-right">Điểm Gamification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leaderboard.map((item) => (
                    <tr key={item.userId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 font-bold text-slate-700">
                        {item.rank === 1 && <span className="w-7 h-7 rounded-full bg-amber-400 text-amber-950 font-bold text-xs inline-flex items-center justify-center shadow-xs">1</span>}
                        {item.rank === 2 && <span className="w-7 h-7 rounded-full bg-slate-300 text-slate-800 font-bold text-xs inline-flex items-center justify-center shadow-xs">2</span>}
                        {item.rank === 3 && <span className="w-7 h-7 rounded-full bg-amber-600 text-white font-bold text-xs inline-flex items-center justify-center shadow-xs">3</span>}
                        {item.rank > 3 && <span className="text-slate-500 font-extrabold pl-2">#{item.rank}</span>}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + item.fullName}
                            alt="Avatar"
                            className="w-9 h-9 rounded-full border border-slate-200 shadow-xs object-cover"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{item.fullName}</span>
                            {item.rank <= 3 && (
                              <span className="text-[10px] font-bold text-orange-600 inline-flex items-center space-x-1">
                                <Star className="w-3 h-3 fill-current" />
                                <span>Innovator Top Tier</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-600 font-semibold">{item.department}</td>
                      <td className="py-4 px-4 text-center font-bold text-slate-700">{item.totalIdeas}</td>
                      <td className="py-4 px-4 text-center">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {item.implementedIdeas}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-mono-metric font-bold text-slate-900">
                        {Number(item.totalSavings || 0).toLocaleString('vi-VN')} đ
                      </td>
                      <td className="py-4 px-4 text-right font-mono-metric font-bold text-orange-600 text-sm">
                        {item.totalScore} pts
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
