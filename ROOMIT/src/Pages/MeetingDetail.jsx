import React, { useState, useEffect } from 'react';
import {
    MapPin, Briefcase, Calendar, Star, Coffee, Home, Volume2,
    MessageCircle, Utensils, Moon, Sun, Cat
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import '../Pages/css/MeetingDetail.css';
import { fetchAllProfiles } from '../services/user';

import useradd from '/src/assets/useradd.svg';
import deluser from '/src/assets/deluser.svg';

const UserProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const currentUserId = "rjsgud49"; // 현재 로그인된 유저 ID
    const [user, setUser] = useState(null);
    const [isFavorited, setIsFavorited] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const data = await fetchAllProfiles();
                const matched = data.find(u => u.userId === id);
                if (!matched || !matched.profile) {
                    setError('해당 유저를 찾을 수 없습니다.');
                } else {
                    const profile = matched.profile;
                    setUser({
                        ...profile,
                        id: matched.userId,
                        interests: matched.interests || [],
                        lifestyle: {
                            wakeUpTime: profile.wakeUpTime,
                            sleepTime: profile.sleepTime,
                            dayNightType: profile.dayNightType
                        },
                        habits: {
                            food: {
                                mealTime: profile.mealTime || '정보없음',
                                kitchenUse: '정보없음',
                                cookingFrequency: '정보없음'
                            },
                            cleaning: {
                                cleanLevel: profile.cleanLevel || '정보없음',
                                cleaningFrequency: '정보없음',
                                sharedSpaceManagement: '정보없음'
                            },
                            noiseSensitivity: {
                                sensitivityLevel: profile.noise || '정보없음',
                                sleepNoisePreference: '정보없음',
                                musicTVVolume: '정보없음'
                            },
                            petPreferences: {
                                allowed: '정보없음',
                                petType: '정보없음',
                                allergy: '정보없음'
                            }
                        }
                    });
                }
            } catch (err) {
                console.error('유저 정보를 불러오는 데 실패했습니다:', err);
                setError('유저 정보를 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, [id]);

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;
    if (!user) return null;

    const lifestyleCategories = [
        {
            title: "🍽️ 식생활 & 주방 관련",
            items: [
                { label: "식사 시간", value: user.habits.food.mealTime },
                { label: "주방 사용", value: user.habits.food.kitchenUse },
                { label: "요리 빈도", value: user.habits.food.cookingFrequency }
            ],
            icon: <Utensils size={40} />
        },
        {
            title: "🧹 청결 및 정리 습관",
            items: [
                { label: "청결 수준", value: user.habits.cleaning.cleanLevel },
                { label: "청소 주기", value: user.habits.cleaning.cleaningFrequency },
                { label: "공용공간 관리", value: user.habits.cleaning.sharedSpaceManagement }
            ],
            icon: <Home size={40} />
        },
        {
            title: "🔊 소음 민감도",
            items: [
                { label: "소음 민감도", value: user.habits.noiseSensitivity.sensitivityLevel },
                { label: "취침시 소음", value: user.habits.noiseSensitivity.sleepNoisePreference },
                { label: "음악/TV 볼륨", value: user.habits.noiseSensitivity.musicTVVolume }
            ],
            icon: <Volume2 size={40} />
        },
        {
            title: "🐶 애완동물",
            items: [
                { label: "반려동물 허용 여부", value: user.habits.petPreferences.allowed },
                { label: "반려동물 종류", value: user.habits.petPreferences.petType },
                { label: "반려동물 알레르기", value: user.habits.petPreferences.allergy }
            ],
            icon: <Cat size={40} />
        }
    ];

    const handleChatClick = () => {
        const sortedIds = [currentUserId, user.id].sort();
        const roomId = `${sortedIds[0]}-${sortedIds[1]}`;
        navigate(`/chat/${roomId}`);
    };

    const handleFavoriteClick = () => {
        setIsFavorited(prev => !prev);
    };

    return (
        <div className="meeting-user-detail">
            <div className="profile-header">
                <div className="profile-image-large">
                    <img
                        src={
                            !user.avatar || user.avatar === '정보없음'
                                ? '/userimg.jpg'
                                : user.avatar
                        }
                        alt={`${user.name}의 프로필`}
                        className="profile-avatardetail"
                    />
                </div>
                <div className="profile-basic-info">
                    <h1>{user.name}, {user.age}세 ({user.gender})</h1>
                    <div className="profile-job-location">
                        <div className="profile-job">
                            <Briefcase size={40} />
                            <span>{user.job}</span>
                        </div>
                        <div className="profile-location">
                            <MapPin size={40} />
                            <span>{user.location}</span>
                        </div>
                    </div>
                </div>
            </div>

            <section className="meetprofile-section">
                <h2>자기소개</h2>
                <p>{user.introduction}</p>
            </section>

            <section className="meetprofile-section">
                <h2>관심사</h2>
                <div className="interests-list">
                    {user.interests.map((interest, index) => (
                        <span key={index} className="interest-tag">{interest}</span>
                    ))}
                </div>
            </section>

            <section className="meetprofile-section">
                <h2>이상적인 룸메이트</h2>
                <p>{user.idealRoommate}</p>
            </section>

            <section className="meetprofile-section lifestyle-details">
                <h2>기본 정보</h2>
                <div className="lifestyle-grid">
                    <div className="lifestyle-item">
                        <Star size={40} />
                        <span>MBTI</span>
                        <strong>{user.mbti}</strong>
                    </div>
                    <div className="lifestyle-item">
                        <Sun size={40} />
                        <span>기상 시간</span>
                        <strong>{user.lifestyle.wakeUpTime}</strong>
                    </div>
                    <div className="lifestyle-item">
                        <Moon size={40} />
                        <span>취침 시간</span>
                        <strong>{user.lifestyle.sleepTime}</strong>
                    </div>
                    <div className="lifestyle-item">
                        <Calendar size={40} />
                        <span>밤낮 성향</span>
                        <strong>{user.lifestyle.dayNightType}</strong>
                    </div>
                    <div className="lifestyle-item">
                        <Coffee size={40} />
                        <span>흡연 여부</span>
                        <strong>{user.smoking}</strong>
                    </div>
                    <div className="lifestyle-item">
                        <Coffee size={40} />
                        <span>음주</span>
                        <strong>{user.drinking}</strong>
                    </div>
                </div>
            </section>

            {lifestyleCategories.map((category, index) => (
                <section key={index} className="meetprofile-section lifestyle-category">
                    <h2>{category.title}</h2>
                    <div className="lifestyle-detail-grid">
                        {category.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="lifestyle-detail-item">
                                {category.icon}
                                <span>{item.label}</span>
                                <strong>{item.value}</strong>
                            </div>
                        ))}
                    </div>
                </section>
            ))}

            <div className="action-buttons">
                <button className="adduser-button" onClick={handleFavoriteClick}>
                    <img
                        src={isFavorited ? deluser : useradd}
                        alt={isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
                        width={40}
                        height={40}
                    />
                    <span>{isFavorited ? '즐겨찾기 제거' : '즐겨찾기'}</span>
                </button>

                <button className="chat-button" onClick={handleChatClick}>
                    <MessageCircle size={40} />
                    채팅하기
                </button>
            </div>
        </div>
    );
};

export default UserProfile;
