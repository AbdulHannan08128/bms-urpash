"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Link from "next/link";
import "./analysis.css";

export default function AnalysisDashboard({ initialUrl }) {
  const [allExams, setAllExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & State
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedClass, setSelectedClass] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // 'overview', 'subjects', 'classes', 'leaderboard', 'registry', 'alerts'
  const [sortField, setSortField] = useState("percentage");
  const [sortOrder, setSortOrder] = useState("desc");

  // Fetch all exams
  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const res = await axios.get(initialUrl || "/api/exams/BULK");
        if (res.data && Array.isArray(res.data)) {
          setAllExams(res.data);
          // Set default selected year to latest available
          const years = [...new Set(res.data.map((e) => e.year).filter(Boolean))].sort().reverse();
          if (years.length > 0) {
            setSelectedYear(years[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching exams for analysis:", err);
        setError("Failed to load examination session records.");
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, [initialUrl]);

  // Available sessions
  const availableYears = useMemo(() => {
    return [...new Set(allExams.map((e) => e.year).filter(Boolean))].sort().reverse();
  }, [allExams]);

  // Filter exams for selected session
  const sessionExams = useMemo(() => {
    if (!selectedYear) return [];
    return allExams.filter((e) => String(e.year) === String(selectedYear));
  }, [allExams, selectedYear]);

  // Aggregate all student marks in selected session
  const processedStudents = useMemo(() => {
    if (sessionExams.length === 0) return [];

    // Collect all unique students
    const studentMap = new Map();

    sessionExams.forEach((exam) => {
      if (exam.data && Array.isArray(exam.data) && exam.data[0]) {
        exam.data[0].forEach((st) => {
          const admKey = String(st.admission);
          if (!studentMap.has(admKey)) {
            studentMap.set(admKey, {
              admission: st.admission,
              name: st.name || "Student",
              father: st.father || "N/A",
              class: st.class || "Unknown",
              examRecords: [],
            });
          }
          studentMap.get(admKey).examRecords.push({
            examName: exam.name,
            shortName: exam.shortName || exam.name,
            maxMarks: Number(exam.marks) || 0,
            english: Number(st.english) || 0,
            math: Number(st.math) || 0,
            science: Number(st.science) || 0,
            urdu: Number(st.urdu) || 0,
            kashmiri: Number(st.kashmiri) || 0,
            sst: Number(st.sst) || 0,
          });
        });
      }
    });

    const isSenior = (cls) => {
      const c = (cls || "").toString().trim().toUpperCase();
      return c === "6TH" || c === "7TH" || c === "8TH";
    };

    const students = Array.from(studentMap.values()).map((student) => {
      const senior = isSenior(student.class);
      const subjects = senior
        ? ["english", "math", "science", "urdu", "kashmiri", "sst"]
        : ["english", "math", "science", "urdu", "kashmiri"];

      // Sum of subject marks across all session exams
      const subjectTotals = {
        english: 0,
        math: 0,
        science: 0,
        urdu: 0,
        kashmiri: 0,
        sst: 0,
      };

      student.examRecords.forEach((rec) => {
        subjects.forEach((sub) => {
          subjectTotals[sub] += Number(rec[sub]) || 0;
        });
      });

      const totalMarks = subjects.reduce((sum, sub) => sum + subjectTotals[sub], 0);

      // Max marks across all session exams
      const totalMax = sessionExams.reduce(
        (sum, exam) => sum + (Number(exam.marks) || 0),
        0
      ) * (senior ? 6 : 5);

      const percentage = totalMax > 0 ? Number(((totalMarks / totalMax) * 100).toFixed(2)) : 0;
      const pass = percentage >= 33;

      let overallGrade = "F";
      if (percentage >= 90) overallGrade = "A+";
      else if (percentage >= 80) overallGrade = "A";
      else if (percentage >= 70) overallGrade = "B+";
      else if (percentage >= 60) overallGrade = "B";
      else if (percentage >= 50) overallGrade = "C";
      else if (percentage >= 33) overallGrade = "D";

      return {
        ...student,
        subjectTotals,
        totalMarks,
        totalMax,
        percentage,
        pass,
        overallGrade,
      };
    });

    // Compute ranks within each class
    const classGroups = {};
    students.forEach((st) => {
      const cls = st.class.toUpperCase();
      if (!classGroups[cls]) classGroups[cls] = [];
      classGroups[cls].push(st);
    });

    Object.keys(classGroups).forEach((cls) => {
      const group = classGroups[cls];
      const sortedMarks = [...new Set(group.map((s) => s.totalMarks))].sort((a, b) => b - a);
      group.forEach((s) => {
        const rankIdx = sortedMarks.indexOf(s.totalMarks) + 1;
        s.classRank = rankIdx;
        const suffix = (n) => (n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th");
        s.rankWithSuffix = `${rankIdx}${suffix(rankIdx)}`;
      });
    });

    return students;
  }, [sessionExams]);

  // Unique classes in this session
  const availableClasses = useMemo(() => {
    return [...new Set(processedStudents.map((s) => s.class))].sort();
  }, [processedStudents]);

  // Filtered students by class and search
  const filteredStudents = useMemo(() => {
    return processedStudents.filter((st) => {
      const matchesClass =
        selectedClass === "ALL" || st.class.toUpperCase() === selectedClass.toUpperCase();
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === "" ||
        st.name.toLowerCase().includes(query) ||
        String(st.admission).includes(query);
      return matchesClass && matchesSearch;
    });
  }, [processedStudents, selectedClass, searchQuery]);

  // Sorted students
  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (typeof aVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });
  }, [filteredStudents, sortField, sortOrder]);

  // KPI Computations
  const stats = useMemo(() => {
    if (filteredStudents.length === 0) {
      return {
        totalStudents: 0,
        passRate: 0,
        passedCount: 0,
        failedCount: 0,
        avgPercentage: 0,
        highestScore: 0,
        highestStudent: null,
        lowestScore: 0,
        lowestStudent: null,
        gradeCounts: { "A+": 0, A: 0, "B+": 0, B: 0, C: 0, D: 0, F: 0 },
      };
    }

    const totalStudents = filteredStudents.length;
    const passedCount = filteredStudents.filter((s) => s.pass).length;
    const failedCount = totalStudents - passedCount;
    const passRate = Number(((passedCount / totalStudents) * 100).toFixed(1));

    const totalPct = filteredStudents.reduce((sum, s) => sum + s.percentage, 0);
    const avgPercentage = Number((totalPct / totalStudents).toFixed(2));

    const sortedByMarks = [...filteredStudents].sort((a, b) => b.totalMarks - a.totalMarks);
    const highestStudent = sortedByMarks[0];
    const lowestStudent = sortedByMarks[sortedByMarks.length - 1];

    const gradeCounts = { "A+": 0, A: 0, "B+": 0, B: 0, C: 0, D: 0, F: 0 };
    filteredStudents.forEach((s) => {
      if (gradeCounts[s.overallGrade] !== undefined) {
        gradeCounts[s.overallGrade]++;
      }
    });

    return {
      totalStudents,
      passRate,
      passedCount,
      failedCount,
      avgPercentage,
      highestScore: highestStudent ? highestStudent.percentage : 0,
      highestStudent,
      lowestScore: lowestStudent ? lowestStudent.percentage : 0,
      lowestStudent,
      gradeCounts,
    };
  }, [filteredStudents]);

  // Class-wise Comparison
  const classComparisons = useMemo(() => {
    const map = {};
    processedStudents.forEach((st) => {
      const cls = st.class;
      if (!map[cls]) {
        map[cls] = { class: cls, count: 0, passCount: 0, totalPct: 0, students: [] };
      }
      map[cls].count++;
      if (st.pass) map[cls].passCount++;
      map[cls].totalPct += st.percentage;
      map[cls].students.push(st);
    });

    return Object.values(map)
      .map((c) => ({
        class: c.class,
        count: c.count,
        passRate: Number(((c.passCount / c.count) * 100).toFixed(1)),
        avgPercentage: Number((c.totalPct / c.count).toFixed(2)),
        topStudent: [...c.students].sort((a, b) => b.totalMarks - a.totalMarks)[0],
      }))
      .sort((a, b) => b.avgPercentage - a.avgPercentage);
  }, [processedStudents]);

  // Subject-wise Analysis
  const subjectAnalysis = useMemo(() => {
    if (filteredStudents.length === 0 || sessionExams.length === 0) return [];
    const subjects = ["english", "math", "science", "urdu", "kashmiri", "sst"];
    const subjectNames = {
      english: "English",
      math: "Mathematics",
      science: "Science / EVS",
      urdu: "Urdu",
      kashmiri: "Kashmiri",
      sst: "Social Studies (SST)",
    };

    const maxExamMarks = sessionExams.reduce((sum, e) => sum + (Number(e.marks) || 0), 0);

    return subjects.map((sub) => {
      // Filter students who took this subject (SST is only for 6th-8th)
      const studentsTaking = filteredStudents.filter((st) => {
        if (sub === "sst") {
          const c = st.class.toUpperCase();
          return c === "6TH" || c === "7TH" || c === "8TH";
        }
        return true;
      });

      if (studentsTaking.length === 0) {
        return {
          id: sub,
          name: subjectNames[sub],
          avgScore: 0,
          avgPct: 0,
          passRate: 0,
          topScore: 0,
          count: 0,
        };
      }

      const totalMarks = studentsTaking.reduce((sum, s) => sum + (s.subjectTotals[sub] || 0), 0);
      const avgScore = Number((totalMarks / studentsTaking.length).toFixed(1));
      const avgPct = maxExamMarks > 0 ? Number(((avgScore / maxExamMarks) * 100).toFixed(1)) : 0;

      const passingStudents = studentsTaking.filter((s) => {
        const score = s.subjectTotals[sub] || 0;
        return maxExamMarks > 0 ? (score / maxExamMarks) * 100 >= 33 : true;
      }).length;
      const passRate = Number(((passingStudents / studentsTaking.length) * 100).toFixed(1));

      const topScore = Math.max(...studentsTaking.map((s) => s.subjectTotals[sub] || 0));

      return {
        id: sub,
        name: subjectNames[sub],
        avgScore,
        avgPct,
        passRate,
        topScore,
        maxMarks: maxExamMarks,
        count: studentsTaking.length,
      };
    });
  }, [filteredStudents, sessionExams]);

  // Export CSV
  const exportToCSV = () => {
    if (sortedStudents.length === 0) return;
    const headers = [
      "Admission",
      "Name",
      "Father's Name",
      "Class",
      "Total Marks",
      "Max Marks",
      "Percentage",
      "Grade",
      "Result",
      "Class Rank",
    ];
    const rows = sortedStudents.map((s) => [
      s.admission,
      `"${s.name}"`,
      `"${s.father}"`,
      s.class,
      s.totalMarks,
      s.totalMax,
      `${s.percentage}%`,
      s.overallGrade,
      s.pass ? "PASS" : "FAIL",
      s.rankWithSuffix,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BMS_Exam_Analysis_${selectedYear}_${selectedClass}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-indigo-900 font-bold text-lg animate-pulse">
            Loading Examination Analytics...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-red-50 border border-red-200 rounded-xl m-6">
        <p className="text-red-700 font-bold">{error}</p>
      </div>
    );
  }

  return (
    <div className="analysis-container">
      {/* Header Banner */}
      <div className="analysis-header">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="analysis-header-title">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Session Exam Analytics & Intelligence
            </h1>
            <p className="analysis-header-subtitle">
              Comprehensive performance metrics, subject mastery, class comparisons, and merit rankings.
            </p>
          </div>

          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2.5 rounded-lg shadow-md transition-all active:scale-95 text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export CSV Report
          </button>
        </div>

        {/* Controls Bar */}
        <div className="analysis-controls">
          <div className="analysis-control-group">
            <span className="analysis-control-label">Session:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="analysis-select"
            >
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  Academic Session {yr}
                </option>
              ))}
            </select>
          </div>

          <div className="analysis-control-group">
            <span className="analysis-control-label">Class:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="analysis-select"
            >
              <option value="ALL">All Classes ({availableClasses.length})</option>
              {availableClasses.map((cls) => (
                <option key={cls} value={cls}>
                  Class {cls}
                </option>
              ))}
            </select>
          </div>

          <div className="relative ml-auto">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search student or admission..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="analysis-search-input"
            />
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        <div className="kpi-card purple">
          <div className="kpi-card-header">
            <span className="kpi-title">Evaluated Students</span>
            <div className="kpi-icon purple">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <div className="kpi-value">{stats.totalStudents}</div>
          <div className="kpi-subtitle">
            Across {sessionExams.length} exams in session {selectedYear}
          </div>
        </div>

        <div className="kpi-card emerald">
          <div className="kpi-card-header">
            <span className="kpi-title">Overall Pass Rate</span>
            <div className="kpi-icon emerald">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="kpi-value">{stats.passRate}%</div>
          <div className="kpi-subtitle text-emerald-600 font-semibold">
            {stats.passedCount} Passed &bull; {stats.failedCount} Needs Support
          </div>
        </div>

        <div className="kpi-card blue">
          <div className="kpi-card-header">
            <span className="kpi-title">Session Mean Score</span>
            <div className="kpi-icon blue">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div className="kpi-value">{stats.avgPercentage}%</div>
          <div className="kpi-subtitle">
            Average across all subjects and grades
          </div>
        </div>

        <div className="kpi-card amber">
          <div className="kpi-card-header">
            <span className="kpi-title">Top Achiever</span>
            <div className="kpi-icon amber">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
          </div>
          <div className="kpi-value">{stats.highestScore}%</div>
          <div className="kpi-subtitle truncate font-semibold text-amber-700">
            {stats.highestStudent ? `${stats.highestStudent.name} (${stats.highestStudent.class})` : "N/A"}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="analysis-tabs">
        <button
          onClick={() => setActiveTab("overview")}
          className={`analysis-tab-btn ${activeTab === "overview" ? "active" : ""}`}
        >
          <span>📊</span> Overview & Insights
        </button>
        <button
          onClick={() => setActiveTab("subjects")}
          className={`analysis-tab-btn ${activeTab === "subjects" ? "active" : ""}`}
        >
          <span>📚</span> Subject Mastery
        </button>
        <button
          onClick={() => setActiveTab("classes")}
          className={`analysis-tab-btn ${activeTab === "classes" ? "active" : ""}`}
        >
          <span>🏫</span> Class Benchmarks
        </button>
        <button
          onClick={() => setActiveTab("leaderboard")}
          className={`analysis-tab-btn ${activeTab === "leaderboard" ? "active" : ""}`}
        >
          <span>🏆</span> Merit Leaderboard
        </button>
        <button
          onClick={() => setActiveTab("registry")}
          className={`analysis-tab-btn ${activeTab === "registry" ? "active" : ""}`}
        >
          <span>📋</span> Student Registry ({filteredStudents.length})
        </button>
        <button
          onClick={() => setActiveTab("alerts")}
          className={`analysis-tab-btn ${activeTab === "alerts" ? "active" : ""}`}
        >
          <span>⚠️</span> Support Alerts ({stats.failedCount})
        </button>
      </div>

      {/* TAB 1: OVERVIEW & INSIGHTS */}
      {activeTab === "overview" && (
        <>
          <div className="analytics-two-col">
            {/* Grade Distribution */}
            <div className="analysis-panel">
              <div className="panel-header">
                <div>
                  <h3 className="panel-title">Grade Performance Distribution</h3>
                  <p className="panel-subtitle">Classification of students by achievement level</p>
                </div>
              </div>

              <div className="grade-distribution-grid">
                <div className="grade-box aplus">
                  <div className="grade-badge-title">A+</div>
                  <div className="text-xl font-bold">{stats.gradeCounts["A+"]}</div>
                  <div className="text-xs opacity-75">90% - 100%</div>
                </div>
                <div className="grade-box a">
                  <div className="grade-badge-title">A</div>
                  <div className="text-xl font-bold">{stats.gradeCounts["A"]}</div>
                  <div className="text-xs opacity-75">80% - 89%</div>
                </div>
                <div className="grade-box bplus">
                  <div className="grade-badge-title">B+</div>
                  <div className="text-xl font-bold">{stats.gradeCounts["B+"]}</div>
                  <div className="text-xs opacity-75">70% - 79%</div>
                </div>
                <div className="grade-box b">
                  <div className="grade-badge-title">B</div>
                  <div className="text-xl font-bold">{stats.gradeCounts["B"]}</div>
                  <div className="text-xs opacity-75">60% - 69%</div>
                </div>
                <div className="grade-box c">
                  <div className="grade-badge-title">C</div>
                  <div className="text-xl font-bold">{stats.gradeCounts["C"]}</div>
                  <div className="text-xs opacity-75">50% - 59%</div>
                </div>
                <div className="grade-box d">
                  <div className="grade-badge-title">D</div>
                  <div className="text-xl font-bold">{stats.gradeCounts["D"]}</div>
                  <div className="text-xs opacity-75">33% - 49%</div>
                </div>
                <div className="grade-box fail">
                  <div className="grade-badge-title">F</div>
                  <div className="text-xl font-bold">{stats.gradeCounts["F"]}</div>
                  <div className="text-xs opacity-75">&lt; 33%</div>
                </div>
              </div>

              {/* Progress Stack Bar */}
              <div className="mt-6">
                <div className="text-xs font-bold text-slate-500 uppercase mb-2">Overall Student Quality Spread</div>
                <div className="w-full h-4 bg-slate-100 rounded-full flex overflow-hidden">
                  {stats.totalStudents > 0 && (
                    <>
                      <div
                        style={{ width: `${(stats.gradeCounts["A+"] / stats.totalStudents) * 100}%` }}
                        className="bg-emerald-500"
                        title={`A+: ${stats.gradeCounts["A+"]}`}
                      ></div>
                      <div
                        style={{ width: `${(stats.gradeCounts["A"] / stats.totalStudents) * 100}%` }}
                        className="bg-green-500"
                        title={`A: ${stats.gradeCounts["A"]}`}
                      ></div>
                      <div
                        style={{ width: `${(stats.gradeCounts["B+"] / stats.totalStudents) * 100}%` }}
                        className="bg-blue-500"
                        title={`B+: ${stats.gradeCounts["B+"]}`}
                      ></div>
                      <div
                        style={{ width: `${(stats.gradeCounts["B"] / stats.totalStudents) * 100}%` }}
                        className="bg-sky-400"
                        title={`B: ${stats.gradeCounts["B"]}`}
                      ></div>
                      <div
                        style={{ width: `${(stats.gradeCounts["C"] / stats.totalStudents) * 100}%` }}
                        className="bg-amber-400"
                        title={`C: ${stats.gradeCounts["C"]}`}
                      ></div>
                      <div
                        style={{ width: `${(stats.gradeCounts["D"] / stats.totalStudents) * 100}%` }}
                        className="bg-orange-400"
                        title={`D: ${stats.gradeCounts["D"]}`}
                      ></div>
                      <div
                        style={{ width: `${(stats.gradeCounts["F"] / stats.totalStudents) * 100}%` }}
                        className="bg-red-500"
                        title={`F: ${stats.gradeCounts["F"]}`}
                      ></div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Class Rank Comparison */}
            <div className="analysis-panel">
              <div className="panel-header">
                <div>
                  <h3 className="panel-title">Class Performance Comparison</h3>
                  <p className="panel-subtitle">Average score across academic grades in {selectedYear}</p>
                </div>
              </div>

              <div>
                {classComparisons.map((item, idx) => (
                  <div key={item.class} className="chart-bar-group">
                    <div className="chart-bar-label">
                      <span>Class {item.class} ({item.count} students)</span>
                      <span className="text-indigo-600 font-bold">{item.avgPercentage}% avg &bull; {item.passRate}% pass</span>
                    </div>
                    <div className="chart-bar-track">
                      <div
                        className={`chart-bar-fill ${
                          idx % 3 === 0 ? "purple" : idx % 3 === 1 ? "blue" : "emerald"
                        }`}
                        style={{ width: `${Math.min(item.avgPercentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Subject Strengths */}
          <div className="analysis-panel">
            <div className="panel-header">
              <div>
                <h3 className="panel-title">Subject Performance Snapshot</h3>
                <p className="panel-subtitle">Mean performance across major curricular subjects</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjectAnalysis.map((sub) => (
                <div key={sub.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-slate-800">{sub.name}</span>
                    <span className="text-xs bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded">
                      {sub.count} Students
                    </span>
                  </div>
                  <div className="text-2xl font-black text-slate-900 mb-2">
                    {sub.avgScore} <span className="text-xs text-slate-500 font-normal">/ {sub.maxMarks} ({sub.avgPct}%)</span>
                  </div>
                  <div className="chart-bar-track mb-2">
                    <div
                      className={`chart-bar-fill ${
                        sub.passRate >= 80 ? "emerald" : sub.passRate >= 60 ? "blue" : "amber"
                      }`}
                      style={{ width: `${Math.min(sub.avgPct, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Pass Rate: <strong className="text-slate-800">{sub.passRate}%</strong></span>
                    <span>Top: <strong className="text-slate-800">{sub.topScore}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* TAB 2: SUBJECT DEEP-DIVE */}
      {activeTab === "subjects" && (
        <div className="analysis-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Curricular Subject Mastery Matrix</h3>
              <p className="panel-subtitle">Comprehensive breakdown by subject across all exams in {selectedYear}</p>
            </div>
          </div>

          <div className="data-table-wrapper">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Students Tested</th>
                  <th>Subject Average</th>
                  <th>Proficiency %</th>
                  <th>Pass Rate</th>
                  <th>Highest Mark</th>
                  <th>Status Assessment</th>
                </tr>
              </thead>
              <tbody>
                {subjectAnalysis.map((sub) => (
                  <tr key={sub.id}>
                    <td className="font-bold text-slate-900">{sub.name}</td>
                    <td>{sub.count}</td>
                    <td>
                      <span className="font-semibold text-slate-800">{sub.avgScore}</span>{" "}
                      <span className="text-xs text-slate-400">/ {sub.maxMarks}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              sub.avgPct >= 70 ? "bg-emerald-500" : sub.avgPct >= 50 ? "bg-blue-500" : "bg-amber-500"
                            }`}
                            style={{ width: `${Math.min(sub.avgPct, 100)}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold text-xs">{sub.avgPct}%</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge-tag ${
                          sub.passRate >= 80 ? "pass" : sub.passRate >= 50 ? "amber" : "fail"
                        }`}
                      >
                        {sub.passRate}%
                      </span>
                    </td>
                    <td className="font-bold text-slate-800">{sub.topScore}</td>
                    <td>
                      {sub.passRate >= 85 ? (
                        <span className="text-xs text-emerald-700 font-bold">🌟 Exceptional</span>
                      ) : sub.passRate >= 65 ? (
                        <span className="text-xs text-blue-700 font-bold">✓ Satisfactory</span>
                      ) : (
                        <span className="text-xs text-rose-700 font-bold">⚠️ Needs Focus</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CLASS BENCHMARKS */}
      {activeTab === "classes" && (
        <div className="analysis-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Class-Wise Academic Benchmarks</h3>
              <p className="panel-subtitle">Comparative assessment across school grades in session {selectedYear}</p>
            </div>
          </div>

          <div className="data-table-wrapper">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Enrolled Candidates</th>
                  <th>Class Mean %</th>
                  <th>Pass Rate</th>
                  <th>Class Topper</th>
                  <th>Top Score</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {classComparisons.map((c) => (
                  <tr key={c.class}>
                    <td className="font-bold text-slate-900 text-base">Class {c.class}</td>
                    <td>{c.count} students</td>
                    <td>
                      <span className="font-bold text-indigo-700 text-base">{c.avgPercentage}%</span>
                    </td>
                    <td>
                      <span className={`badge-tag ${c.passRate >= 75 ? "pass" : "amber"}`}>
                        {c.passRate}% Pass
                      </span>
                    </td>
                    <td className="font-semibold text-slate-800">
                      {c.topStudent ? c.topStudent.name : "N/A"}
                    </td>
                    <td className="font-bold text-emerald-700">
                      {c.topStudent ? `${c.topStudent.percentage}%` : "N/A"}
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          setSelectedClass(c.class);
                          setActiveTab("registry");
                        }}
                        className="text-indigo-600 hover:text-indigo-900 text-xs font-bold underline"
                      >
                        Inspect Students &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: MERIT LEADERBOARD */}
      {activeTab === "leaderboard" && (
        <div className="analysis-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Academic Merit & Top Rankers</h3>
              <p className="panel-subtitle">Leading students in {selectedClass === "ALL" ? "All Classes" : `Class ${selectedClass}`} for session {selectedYear}</p>
            </div>
          </div>

          <div className="leaderboard-list">
            {[...filteredStudents]
              .sort((a, b) => b.totalMarks - a.totalMarks)
              .slice(0, 10)
              .map((st, idx) => (
                <div
                  key={st.admission}
                  className={`leaderboard-item ${
                    idx === 0 ? "rank-1" : idx === 1 ? "rank-2" : idx === 2 ? "rank-3" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`rank-badge ${
                        idx === 0
                          ? "rank-1"
                          : idx === 1
                          ? "rank-2"
                          : idx === 2
                          ? "rank-3"
                          : "standard"
                      }`}
                    >
                      {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{st.name}</h4>
                      <p className="text-xs text-slate-500">
                        Class {st.class} &bull; Roll #{st.admission} &bull; S/O {st.father}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="font-black text-indigo-700 text-lg">
                        {st.totalMarks} <span className="text-xs text-slate-400">/ {st.totalMax}</span>
                      </div>
                      <div className="text-xs font-bold text-slate-500">
                        {st.percentage}% &bull; Grade {st.overallGrade}
                      </div>
                    </div>

                    <Link
                      href={`/admin/exams/session/${selectedYear}?admission=${st.admission}`}
                      className="btn-action"
                    >
                      Print Card
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 5: STUDENT REGISTRY */}
      {activeTab === "registry" && (
        <div className="analysis-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Student Academic Registry</h3>
              <p className="panel-subtitle">
                Showing {sortedStudents.length} candidate records for session {selectedYear}
              </p>
            </div>
          </div>

          <div className="data-table-wrapper">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("classRank")} className="cursor-pointer">
                    Rank {sortField === "classRank" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("admission")} className="cursor-pointer">
                    Admission {sortField === "admission" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("name")} className="cursor-pointer">
                    Student Name {sortField === "name" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("class")} className="cursor-pointer">
                    Class {sortField === "class" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("totalMarks")} className="cursor-pointer">
                    Total Marks {sortField === "totalMarks" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("percentage")} className="cursor-pointer">
                    Percentage {sortField === "percentage" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th>Grade</th>
                  <th>Result</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedStudents.map((st) => (
                  <tr key={st.admission}>
                    <td className="font-bold text-slate-700">{st.rankWithSuffix}</td>
                    <td className="font-mono text-xs text-slate-600">{st.admission}</td>
                    <td>
                      <div className="font-bold text-slate-900">{st.name}</div>
                      <div className="text-xs text-slate-400">S/O {st.father}</div>
                    </td>
                    <td className="font-semibold text-slate-800">{st.class}</td>
                    <td>
                      <span className="font-bold text-slate-800">{st.totalMarks}</span>
                      <span className="text-xs text-slate-400"> / {st.totalMax}</span>
                    </td>
                    <td>
                      <span className="font-bold text-indigo-700">{st.percentage}%</span>
                    </td>
                    <td>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-black ${
                          st.overallGrade.startsWith("A")
                            ? "bg-emerald-100 text-emerald-800"
                            : st.overallGrade.startsWith("B")
                            ? "bg-blue-100 text-blue-800"
                            : st.overallGrade === "C"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {st.overallGrade}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-tag ${st.pass ? "pass" : "fail"}`}>
                        {st.pass ? "PASS" : "FAIL"}
                      </span>
                    </td>
                    <td>
                      <Link
                        href={`/admin/exams/session/${selectedYear}?admission=${st.admission}`}
                        className="text-indigo-600 hover:text-indigo-900 text-xs font-bold underline"
                      >
                        Print Card
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: SUPPORT ALERTS */}
      {activeTab === "alerts" && (
        <div className="analysis-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title text-rose-700">Academic Intervention & Support Alerts</h3>
              <p className="panel-subtitle">Students requiring remedial academic guidance and teacher intervention</p>
            </div>
          </div>

          {filteredStudents.filter((s) => !s.pass).length === 0 ? (
            <div className="p-8 text-center bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-3xl block mb-2">🎉</span>
              <h4 className="font-bold text-emerald-800 text-lg">Outstanding Performance!</h4>
              <p className="text-emerald-700 text-sm">
                Every student in this selection has passed with 33% or higher. No intervention alerts currently active.
              </p>
            </div>
          ) : (
            <div className="data-table-wrapper">
              <table className="analytics-table">
                <thead>
                  <tr>
                    <th>Admission</th>
                    <th>Student Name</th>
                    <th>Class</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Failing Subjects</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents
                    .filter((s) => !s.pass)
                    .map((st) => (
                      <tr key={st.admission} className="bg-rose-50/50">
                        <td className="font-mono text-xs">{st.admission}</td>
                        <td className="font-bold text-slate-900">{st.name}</td>
                        <td className="font-semibold">{st.class}</td>
                        <td className="font-bold text-rose-700">{st.totalMarks} / {st.totalMax}</td>
                        <td className="font-bold text-rose-800">{st.percentage}%</td>
                        <td>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(st.subjectTotals)
                              .filter(([_, marks]) => marks < 15)
                              .map(([sub, marks]) => (
                                <span
                                  key={sub}
                                  className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded font-semibold capitalize"
                                >
                                  {sub}: {marks}
                                </span>
                              ))}
                          </div>
                        </td>
                        <td>
                          <Link
                            href={`/admin/exams/session/${selectedYear}?admission=${st.admission}`}
                            className="btn-action bg-rose-600 hover:bg-rose-700"
                          >
                            Card Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
