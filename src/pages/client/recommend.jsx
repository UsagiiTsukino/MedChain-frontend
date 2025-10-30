import { AlertFilled, CalendarFilled, SearchOutlined, SketchCircleFilled, UserAddOutlined } from '@ant-design/icons';
import React, { useState, useEffect, useMemo } from 'react';


// Mock database với thông tin vaccine chi tiết
const vaccineDatabase = [
  {
    id: 1,
    name: 'Pfizer-BioNTech COVID-19',
    type: 'mRNA',
    diseases: ['COVID-19', 'SARS-CoV-2'],
    ageGroups: ['12+', 'adult', 'elderly'],
    riskGroups: ['immunocompromised', 'healthcare', 'chronic_disease'],
    sideEffects: [
      'pain at injection site',
      'fatigue',
      'headache',
      'muscle aches',
    ],
    contraindications: ['severe allergic reaction to components'],
    dosage: '2 doses, 21 days apart',
    booster: 'recommended after 6 months',
    description:
      'Vaccine mRNA phòng COVID-19 hiệu quả cao, phù hợp cho người trên 12 tuổi',
    efficacy: 95,
    manufacturer: 'Pfizer-BioNTech',
    storage: '-70°C',
    duration: '6-12 months protection',
  },
  {
    id: 2,
    name: 'Hepatitis B',
    type: 'recombinant',
    diseases: ['Hepatitis B', 'HBV'],
    ageGroups: ['newborn', 'infant', 'child', 'adult'],
    riskGroups: ['healthcare', 'high_risk_sexual', 'drug_users'],
    sideEffects: ['mild fever', 'pain at injection site'],
    contraindications: ['severe illness', 'allergy to yeast'],
    dosage: '3 doses: 0, 1, 6 months',
    booster: 'not routinely recommended',
    description:
      'Vaccine phòng viêm gan B, quan trọng cho trẻ sơ sinh và người có nguy cơ cao',
    efficacy: 90,
    manufacturer: 'Various',
    storage: '2-8°C',
    duration: 'lifelong protection',
  },
  {
    id: 3,
    name: 'MMR (Measles, Mumps, Rubella)',
    type: 'live attenuated',
    diseases: ['Measles', 'Mumps', 'Rubella'],
    ageGroups: ['infant', 'child', 'adult'],
    riskGroups: ['pregnant_women_planning', 'travelers'],
    sideEffects: ['mild rash', 'fever', 'swollen glands'],
    contraindications: ['pregnancy', 'immunocompromised', 'severe illness'],
    dosage: '2 doses: 12-15 months, 4-6 years',
    booster: 'adults born before 1957 may need',
    description:
      'Vaccine phòng sởi, quai bị, rubella - quan trọng cho trẻ em và phụ nữ chuẩn bị có thai',
    efficacy: 97,
    manufacturer: 'Merck',
    storage: '2-8°C, protect from light',
    duration: 'lifelong immunity',
  },
  {
    id: 4,
    name: 'Influenza (Flu) Vaccine',
    type: 'inactivated',
    diseases: ['Influenza A', 'Influenza B', 'H1N1', 'H3N2'],
    ageGroups: ['6months+', 'child', 'adult', 'elderly'],
    riskGroups: ['elderly', 'chronic_disease', 'pregnant', 'healthcare'],
    sideEffects: ['mild soreness', 'low-grade fever'],
    contraindications: [
      'severe egg allergy',
      'previous Guillain-Barré syndrome',
    ],
    dosage: '1 dose annually',
    booster: 'annual vaccination required',
    description:
      'Vaccine phòng cúm hàng năm, đặc biệt quan trọng cho người già và nhóm có nguy cơ cao',
    efficacy: 60,
    manufacturer: 'Multiple manufacturers',
    storage: '2-8°C',
    duration: '1 year protection',
  },
  {
    id: 5,
    name: 'Tetanus-Diphtheria (Td)',
    type: 'toxoid',
    diseases: ['Tetanus', 'Diphtheria'],
    ageGroups: ['child', 'adult', 'elderly'],
    riskGroups: ['wound_prone', 'travelers', 'healthcare'],
    sideEffects: ['pain and swelling at injection site'],
    contraindications: ['severe illness', 'previous severe reaction'],
    dosage: 'Primary series in childhood, boosters every 10 years',
    booster: 'every 10 years',
    description: 'Vaccine phòng uốn ván và bạch hầu, cần tiêm nhắc lại định kỳ',
    efficacy: 95,
    manufacturer: 'Various',
    storage: '2-8°C',
    duration: '10 years protection',
  },
  {
    id: 6,
    name: 'Pneumococcal (PCV13)',
    type: 'conjugate',
    diseases: ['Pneumococcal disease', 'Pneumonia', 'Meningitis'],
    ageGroups: ['infant', 'child', 'elderly', 'adult'],
    riskGroups: ['immunocompromised', 'chronic_lung_disease', 'elderly'],
    sideEffects: ['redness at injection site', 'mild fever'],
    contraindications: ['severe illness', 'allergy to components'],
    dosage: '4 doses: 2, 4, 6, 12-15 months',
    booster: 'adults 65+ may need',
    description:
      'Vaccine phòng bệnh phế cầu, quan trọng cho trẻ nhỏ và người cao tuổi',
    efficacy: 85,
    manufacturer: 'Pfizer',
    storage: '2-8°C',
    duration: 'several years protection',
  },
];

// Vector embeddings đơn giản (trong thực tế sẽ sử dụng models như BERT, Sentence-BERT)
const createSimpleEmbedding = (text) => {
  const words = text.toLowerCase().split(/\s+/);
  const keywordWeights = {
    covid: 10,
    corona: 10,
    sars: 10,
    hepatitis: 8,
    gan: 8,
    measles: 7,
    sởi: 7,
    mumps: 7,
    'quai bị': 7,
    rubella: 7,
    flu: 6,
    cúm: 6,
    influenza: 6,
    tetanus: 5,
    'uốn ván': 5,
    diphtheria: 5,
    'bạch hầu': 5,
    pneumonia: 5,
    'phế cầu': 5,
    child: 4,
    'trẻ em': 4,
    infant: 4,
    'trẻ sơ sinh': 4,
    adult: 3,
    'người lớn': 3,
    elderly: 4,
    'người già': 4,
    pregnant: 5,
    'có thai': 5,
    healthcare: 3,
    'y tế': 3,
  };

  let score = 0;
  words.forEach((word) => {
    score += keywordWeights[word] || 0;
  });

  return { score, words };
};

// Hàm tính similarity đơn giản
const calculateSimilarity = (query, vaccine) => {
  const queryEmbedding = createSimpleEmbedding(query);

  let score = 0;

  // Tìm kiếm trong tên vaccine
  const nameScore = createSimpleEmbedding(vaccine.name).score;
  if (vaccine.name.toLowerCase().includes(query.toLowerCase())) score += 20;

  // Tìm kiếm trong diseases
  vaccine.diseases.forEach((disease) => {
    if (disease.toLowerCase().includes(query.toLowerCase())) score += 15;
    score += createSimpleEmbedding(disease).score * 0.1;
  });

  // Tìm kiếm trong age groups
  vaccine.ageGroups.forEach((age) => {
    if (query.toLowerCase().includes(age.toLowerCase())) score += 10;
  });

  // Tìm kiếm trong risk groups
  vaccine.riskGroups.forEach((risk) => {
    if (query.toLowerCase().includes(risk.toLowerCase())) score += 8;
  });

  // Tìm kiếm trong description
  if (vaccine.description.toLowerCase().includes(query.toLowerCase()))
    score += 12;

  score += queryEmbedding.score * 0.1;

  return score;
};

// RAG System Component
const VaccineRAGSystem = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [userProfile, setUserProfile] = useState({
    age: '',
    riskFactors: [],
    medicalHistory: [],
    previousVaccinations: [],
  });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Retrieve and Rank vaccines based on query
  const retrieveVaccines = (searchQuery, topK = 5) => {
    if (!searchQuery.trim()) return [];

    const scoredVaccines = vaccineDatabase.map((vaccine) => ({
      ...vaccine,
      similarity: calculateSimilarity(searchQuery, vaccine),
    }));

    return scoredVaccines
      .filter((v) => v.similarity > 0)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  };

  // Generate personalized recommendations
  const generatePersonalizedRecommendations = (vaccines, profile) => {
    return vaccines
      .map((vaccine) => {
        let personalizedScore = vaccine.similarity;

        // Age-based scoring
        if (profile.age) {
          const age = parseInt(profile.age);
          vaccine.ageGroups.forEach((ageGroup) => {
            if (
              (ageGroup === 'infant' && age < 2) ||
              (ageGroup === 'child' && age >= 2 && age < 18) ||
              (ageGroup === 'adult' && age >= 18 && age < 65) ||
              (ageGroup === 'elderly' && age >= 65) ||
              (ageGroup.includes('+') && age >= parseInt(ageGroup))
            ) {
              personalizedScore += 5;
            }
          });
        }

        // Risk factor scoring
        profile.riskFactors.forEach((risk) => {
          if (vaccine.riskGroups.includes(risk)) {
            personalizedScore += 8;
          }
        });

        return { ...vaccine, personalizedScore };
      })
      .sort((a, b) => b.personalizedScore - a.personalizedScore);
  };

  // Handle search
  const handleSearch = () => {
    const retrieved = retrieveVaccines(query);
    const personalized = generatePersonalizedRecommendations(
      retrieved,
      userProfile
    );
    setResults(personalized);
  };

  // Generate AI explanation
  const generateExplanation = (vaccine, query, profile) => {
    const explanation = `Tôi gợi ý vaccine ${vaccine.name} vì: `;

    const reasons = [];

    if (query.toLowerCase().includes('covid')) {
      reasons.push('bạn quan tâm đến vaccine COVID-19');
    }

    if (profile.age) {
      const age = parseInt(profile.age);
      vaccine.ageGroups.forEach((ageGroup) => {
        if (
          (ageGroup === 'infant' && age < 2) ||
          (ageGroup === 'child' && age >= 2 && age < 18) ||
          (ageGroup === 'adult' && age >= 18 && age < 65) ||
          (ageGroup === 'elderly' && age >= 65)
        ) {
          reasons.push(`phù hợp với độ tuổi ${age} của bạn`);
        }
      });
    }

    profile.riskFactors.forEach((risk) => {
      if (vaccine.riskGroups.includes(risk)) {
        reasons.push(`bạn thuộc nhóm nguy cơ cao (${risk})`);
      }
    });

    if (vaccine.efficacy >= 90) {
      reasons.push(`có hiệu quả cao (${vaccine.efficacy}%)`);
    }

    if (reasons.length === 0) {
      reasons.push('phù hợp với yêu cầu tìm kiếm của bạn');
    }

    return explanation + reasons.join(', ') + '.';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-blue-600 flex items-center">
            <SketchCircleFilled className="mr-3" />
            Hệ Thống RAG Gợi Ý Vaccine
          </h1>
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600"
          >
            <UserAddOutlined className="mr-2" size={16} />
            Hồ Sơ Cá Nhân
          </button>
        </div>

        {/* Search Interface */}
        <div className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <SearchOutlined
                className="absolute left-3 top-3 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Tìm kiếm vaccine (ví dụ: covid, cúm, vaccine cho trẻ em, vaccine du lịch...)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Tìm Kiếm
            </button>
          </div>
        </div>

        {/* Quick Search Suggestions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Gợi Ý Tìm Kiếm Nhanh:</h3>
          <div className="flex flex-wrap gap-2">
            {[
              'vaccine covid',
              'vaccine cho trẻ em',
              'vaccine cúm',
              'vaccine du lịch',
              'vaccine người già',
              'vaccine có thai',
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setQuery(suggestion);
                  handleSearch();
                }}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200 text-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Kết Quả Gợi Ý Vaccine
            </h2>
            {results.map((vaccine, index) => (
              <div
                key={vaccine.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-blue-600 mb-2">
                      #{index + 1} {vaccine.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                        Hiệu quả: {vaccine.efficacy}%
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Loại: {vaccine.type}
                      </span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        Độ phù hợp: {Math.round(vaccine.personalizedScore)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Generated Explanation */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                  <div className="flex items-start">
                    <SketchCircleFilled
                      className="mr-2 mt-1 text-blue-500"
                      size={16}
                    />
                    <p className="text-blue-800 font-medium">
                      {generateExplanation(vaccine, query, userProfile)}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-700 mb-3">{vaccine.description}</p>

                    <div className="space-y-2">
                      <div>
                        <span className="font-semibold text-gray-700">
                          Phòng chống:{' '}
                        </span>
                        <span className="text-gray-600">
                          {vaccine.diseases.join(', ')}
                        </span>
                      </div>

                      <div>
                        <span className="font-semibold text-gray-700">
                          Nhóm tuổi:{' '}
                        </span>
                        <span className="text-gray-600">
                          {vaccine.ageGroups.join(', ')}
                        </span>
                      </div>

                      <div>
                        <span className="font-semibold text-gray-700">
                          Liều lượng:{' '}
                        </span>
                        <span className="text-gray-600">{vaccine.dosage}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="space-y-2">
                      <div>
                        <span className="font-semibold text-gray-700">
                          Nhóm nguy cơ cao:{' '}
                        </span>
                        <span className="text-gray-600">
                          {vaccine.riskGroups.join(', ')}
                        </span>
                      </div>

                      <div>
                        <span className="font-semibold text-gray-700">
                          Tác dụng phụ:{' '}
                        </span>
                        <span className="text-gray-600">
                          {vaccine.sideEffects.join(', ')}
                        </span>
                      </div>

                      <div>
                        <span className="font-semibold text-gray-700">
                          Chống chỉ định:{' '}
                        </span>
                        <span className="text-gray-600">
                          {vaccine.contraindications.join(', ')}
                        </span>
                      </div>

                      <div>
                        <span className="font-semibold text-gray-700">
                          Thời gian bảo vệ:{' '}
                        </span>
                        <span className="text-gray-600">
                          {vaccine.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Nhà sản xuất: {vaccine.manufacturer} | Bảo quản:{' '}
                    {vaccine.storage}
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center">
                      <CalendarFilled className="mr-1" size={16} />
                      Đặt Lịch
                    </button>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                      Chi Tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Profile Modal */}
        {isProfileModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-bold mb-4">Hồ Sơ Cá Nhân</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tuổi</label>
                  <input
                    type="number"
                    value={userProfile.age}
                    onChange={(e) =>
                      setUserProfile({ ...userProfile, age: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Nhập tuổi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Yếu Tố Nguy Cơ
                  </label>
                  <div className="space-y-2">
                    {[
                      'immunocompromised',
                      'healthcare',
                      'chronic_disease',
                      'pregnant',
                      'elderly',
                    ].map((risk) => (
                      <label key={risk} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={userProfile.riskFactors.includes(risk)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setUserProfile({
                                ...userProfile,
                                riskFactors: [...userProfile.riskFactors, risk],
                              });
                            } else {
                              setUserProfile({
                                ...userProfile,
                                riskFactors: userProfile.riskFactors.filter(
                                  (r) => r !== risk
                                ),
                              });
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm">{risk}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setIsProfileModalOpen(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                >
                  Đóng
                </button>
                <button
                  onClick={() => {
                    setIsProfileModalOpen(false);
                    if (query) handleSearch();
                  }}
                  className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                  Lưu & Tìm Kiếm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {query && results.length === 0 && (
          <div className="text-center py-12">
            <AlertFilled className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 text-lg">
              Không tìm thấy vaccine phù hợp với yêu cầu của bạn.
            </p>
            <p className="text-gray-400">
              Thử tìm kiếm với từ khóa khác hoặc cập nhật hồ sơ cá nhân.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VaccineRAGSystem;
