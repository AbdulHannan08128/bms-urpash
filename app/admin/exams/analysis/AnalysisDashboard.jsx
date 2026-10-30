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
        console.error("Error fetching exams for analytics:", err);
        setError("Failed to load exam data. Please check your network connection.");
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

  // Helper to generate a collision-free unique key for each student
  const getStudentKey = (st) => {
    const hasValidAdm =
      st.admission !== undefined &&
      st.admission !== null &&
      String(st.admission).trim() !== "" &&
      String(st.admission).toLowerCase() !== "undefined" &&
      String(st.admission).toLowerCase() !== "null";

    if (hasValidAdm) {
      return `adm_${String(st.admission).trim()}`;
    }
    const cleanName = (st.name || "").trim().toLowerCase();
    const cleanClass = (st.class || "").trim().toLowerCase();
    const cleanFather = (st.father || "").trim().toLowerCase();
    return `name_${cleanName}_${cleanClass}_${cleanFather}`;
  };

  // Aggregate all student marks in selected session
  const processedStudents = useMemo(() => {
    if (sessionExams.length === 0) return [];

    // Collect all unique students
    const studentMap = new Map();

    sessionExams.forEach((exam) => {
      if (exam.data && Array.isArray(exam.data) && exam.data[0]) {
        exam.data[0].forEach((st) => {
          const admKey = getStudentKey(st);
          if (!studentMap.has(admKey)) {
            const hasValidAdm =
              st.admission !== undefined &&
              st.admission !== null &&
              String(st.admission).trim() !== "" &&
              String(st.admission).toLowerCase() !== "undefined";

            studentMap.set(admKey, {
              uniqueKey: admKey,
              admission: hasValidAdm ? String(st.admission).trim() : "N/A",
              name: (st.name || "Student").trim(),
              father: (st.father || "N/A").trim(),
              class: (st.class || "Unknown").trim(),
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

      // Total max marks per subject across exams the student was evaluated in
      const studentMaxPerSubject = student.examRecords.reduce(
        (sum, rec) => sum + (Number(rec.maxMarks) || 0),
        0
      );
      const subjectCount = senior ? 6 : 5;
      const totalMax = studentMaxPerSubject > 0
        ? studentMaxPerSubject * subjectCount
        : (senior ? 600 : 500);

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

    // Also compute session-wide rank based on percentage
    const sortedPct = [...new Set(students.map((s) => s.percentage))].sort((a, b) => b - a);
    students.forEach((s) => {
      const sRank = sortedPct.indexOf(s.percentage) + 1;
      s.sessionRank = sRank;
      const suffix = (n) => (n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th");
      s.sessionRankWithSuffix = `${sRank}${suffix(sRank)}`;
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
        String(st.admission).toLowerCase().includes(query) ||
        st.father.toLowerCase().includes(query);
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

  // Top Rankers for Leaderboard
  const leaderboardStudents = useMemo(() => {
    return [...filteredStudents]
      .sort((a, b) => {
        if (selectedClass === "ALL") {
          return b.percentage - a.percentage;
        }
        return b.totalMarks - a.totalMarks;
      })
      .slice(0, 15);
  }, [filteredStudents, selectedClass]);

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
    const avgPercentage = Number((totalPct / totalStudents).toFixed(1));

    const sortedByPct = [...filteredStudents].sort((a, b) => b.percentage - a.percentage);
    const highestStudent = sortedByPct[0] || null;
    const lowestStudent = sortedByPct[sortedByPct.length - 1] || null;

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

  // Class Comparisons
  const classComparisons = useMemo(() => {
    if (processedStudents.length === 0) return [];

    const map = {};
    processedStudents.forEach((st) => {
      const cls = st.class.toUpperCase();
      if (!map[cls]) {
        map[cls] = {
          class: st.class,
          students: [],
        };
      }
      map[cls].students.push(st);
    });

    return Object.values(map)
      .map((entry) => {
        const total = entry.students.length;
        const passed = entry.students.filter((s) => s.pass).length;
        const passRate = total > 0 ? Number(((passed / total) * 100).toFixed(1)) : 0;
        const avgPct =
          total > 0
            ? Number(
                (
                  entry.students.reduce((sum, s) => sum + s.percentage, 0) / total
                ).toFixed(1)
              )
            : 0;

        const topStudent = [...entry.students].sort((a, b) => b.percentage - a.percentage)[0];

        return {
          class: entry.class,
          count: total,
          passRate,
          avgPercentage: avgPct,
          topStudent,
        };
      })
      .sort((a, b) => b.avgPercentage - a.avgPercentage);
  }, [processedStudents]);

  // Subject Mastery Analytics
  const subjectAnalysis = useMemo(() => {
    if (filteredStudents.length === 0 || sessionExams.length === 0) return [];

    const subjectKeys = ["english", "math", "science", "urdu", "kashmiri", "sst"];
    const subjectNames = {
      english: "English",
      math: "Mathematics",
      science: "General Science",
      urdu: "Urdu",
      kashmiri: "Kashmiri",
      sst: "Social Studies (SST)",
    };

    // Calculate max possible marks across the session exams for one subject
    const maxExamMarks = sessionExams.reduce((sum, e) => sum + (Number(e.marks) || 0), 0);

    return subjectKeys.map((sub) => {
      const studentsTaking = filteredStudents.filter((s) => {
        if (sub === "sst") {
          const c = s.class.toUpperCase();
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
          maxMarks: maxExamMarks,
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
      "Class Rank",
      "Total Marks",
      "Max Marks",
      "Percentage",
      "Grade",
      "Result",
    ];
    const rows = sortedStudents.map((s) => [
      s.admission,
      `"${s.name}"`,
      `"${s.father}"`,
      s.class,
      s.rankWithSuffix,
      s.totalMarks,
      s.totalMax,
      `${s.percentage}%`,
      s.overallGrade,
      s.pass ? "PASS" : "FAIL",
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
      <div className="flex justify-center items-center h-[70vh] p-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-indigo-950 font-bold text-base sm:text-lg animate-pulse">
            Analyzing Academic Session Records...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center bg-red-50 border border-red-200 rounded-xl m-4">
        <p className="text-red-700 font-bold">{error}</p>
      </div>
    );
  }

  return (
    <div className="analysis-container">
      {/* Top Breadcrumb & Back Link */}
      <div className="mb-2.5 flex items-center justify-between">
        <Link
          href="/admin/exams"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Exams Management
        </Link>
        <span className="text-xs text-slate-500 font-medium">BMS Urpash Academic Intelligence</span>
      </div>

      {/* Header Banner */}
      <div className="analysis-header">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="analysis-header-title">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-400 flex-shrink-0"
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
              <span>Session Exam Intelligence & Analytics</span>
            </h1>
            <p className="analysis-header-subtitle">
              Comprehensive performance evaluation, subject mastery breakdown, class benchmarks, and merit leaderboards.
            </p>
          </div>

          <button
            onClick={exportToCSV}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2.5 rounded-lg shadow-md transition-all active:scale-95 text-xs sm:text-sm w-full md:w-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 flex-shrink-0"
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

          <div className="relative analysis-search-wrapper md:ml-auto">
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
              placeholder="Search candidate name or admission..."
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
            <span className="kpi-title">Examinees</span>
            <div className="kpi-icon purple">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <div className="kpi-value">{stats.totalStudents}</div>
          <div className="kpi-subtitle">
            {sessionExams.length} exams &bull; {selectedClass === "ALL" ? "All grades" : `Class ${selectedClass}`}
          </div>
        </div>

        <div className="kpi-card emerald">
          <div className="kpi-card-header">
            <span className="kpi-title">Pass Rate</span>
            <div className="kpi-icon emerald">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="kpi-value">{stats.passRate}%</div>
          <div className="kpi-subtitle text-emerald-700 font-semibold">
            {stats.passedCount} Passed &bull; {stats.failedCount} Alerts
          </div>
        </div>

        <div className="kpi-card blue">
          <div className="kpi-card-header">
            <span className="kpi-title">Average Mean</span>
            <div className="kpi-icon blue">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div className="kpi-value">{stats.avgPercentage}%</div>
          <div className="kpi-subtitle">
            Mean aggregate performance
          </div>
        </div>

        <div className="kpi-card amber">
          <div className="kpi-card-header">
            <span className="kpi-title">Session Topper</span>
            <div className="kpi-icon amber">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
          </div>
          <div className="kpi-value">{stats.highestScore}%</div>
          <div className="kpi-subtitle truncate font-medium text-amber-800">
            {stats.highestStudent ? `${stats.highestStudent.name} (${stats.highestStudent.class})` : "N/A"}
          </div>
        </div>
      </div>

      {/* Sticky Pill Navigation Tabs */}
      <div className="analysis-tabs-wrapper">
        <div className="analysis-tabs">
          <button
            onClick={() => setActiveTab("overview")}
            className={`analysis-tab-btn ${activeTab === "overview" ? "active" : ""}`}
          >
            <span>📊</span> Overview & Insights
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`analysis-tab-btn ${activeTab === "leaderboard" ? "active" : ""}`}
          >
            <span>🏆</span> Merit Leaderboard
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
            onClick={() => setActiveTab("registry")}
            className={`analysis-tab-btn ${activeTab === "registry" ? "active" : ""}`}
          >
            <span>📋</span> Student Registry ({filteredStudents.length})
          </button>
          <button
            onClick={() => setActiveTab("alerts")}
            className={`analysis-tab-btn ${activeTab === "alerts" ? "active" : ""}`}
          >
            <span>⚠️</span> Remedial Support ({stats.failedCount})
          </button>
        </div>
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

              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap justify-between items-center text-xs text-slate-500 gap-2">
                <span>Pass Standard: 33% per subject</span>
                <span className="font-semibold text-indigo-700">
                  {stats.passedCount} / {stats.totalStudents} Candidates Cleared
                </span>
              </div>
            </div>

            {/* Quick Insights & Academic Highlights */}
            <div className="analysis-panel">
              <div className="panel-header">
                <div>
                  <h3 className="panel-title">Academic Highlights & Health</h3>
                  <p className="panel-subtitle">Summary metrics for Session {selectedYear}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🥇</span>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">
                        {stats.highestStudent ? stats.highestStudent.name : "N/A"}
                      </div>
                      <div className="text-xs text-slate-500">
                        {stats.highestStudent ? `Class ${stats.highestStudent.class}` : "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-indigo-700 text-base">
                      {stats.highestScore}%
                    </span>
                    <span className="text-xs block text-emerald-600 font-bold">Top Score</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🏫</span>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">Top Performing Class</div>
                      <div className="text-xs text-slate-500">
                        {classComparisons[0] ? `Class ${classComparisons[0].class} (${classComparisons[0].count} students)` : "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-emerald-700 text-base">
                      {classComparisons[0] ? `${classComparisons[0].avgPercentage}%` : "0%"}
                    </span>
                    <span className="text-xs block text-slate-400 font-medium">Mean Score</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">Intervention Required</div>
                      <div className="text-xs text-slate-500">Students below passing mark</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-rose-600 text-base">{stats.failedCount}</span>
                    <span className="text-xs block text-rose-500 font-medium">Need Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: MERIT LEADERBOARD */}
      {activeTab === "leaderboard" && (
        <div className="analysis-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Academic Merit & Top Rankers</h3>
              <p className="panel-subtitle">
                {selectedClass === "ALL"
                  ? `Rankings based on overall percentage across all classes for session ${selectedYear}`
                  : `Leading students in Class ${selectedClass} for session ${selectedYear}`}
              </p>
            </div>
          </div>

          <div className="leaderboard-list">
            {leaderboardStudents.map((st, idx) => (
              <div
                key={st.uniqueKey}
                className={`leaderboard-item ${
                  idx === 0 ? "rank-1" : idx === 1 ? "rank-2" : idx === 2 ? "rank-3" : ""
                }`}
              >
                <div className="leaderboard-header">
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
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base truncate">{st.name}</h4>
                    <p className="text-xs text-slate-500 truncate">
                      Class {st.class} &bull; Class Rank: {st.rankWithSuffix} &bull; {st.admission !== "N/A" ? `Roll #${st.admission}` : `S/O ${st.father}`}
                    </p>
                  </div>
                </div>

                <div className="leaderboard-meta">
                  <div className="text-left sm:text-right">
                    <div className="font-black text-indigo-700 text-base sm:text-lg">
                      {st.totalMarks} <span className="text-xs text-slate-400">/ {st.totalMax}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-500">
                      {st.percentage}% &bull; Grade {st.overallGrade}
                    </div>
                  </div>

                  <Link
                    href={`/admin/exams/session/${selectedYear}?admission=${
                      st.admission !== "N/A" ? st.admission : encodeURIComponent(st.name)
                    }`}
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

      {/* TAB 3: SUBJECT MASTERY */}
      {activeTab === "subjects" && (
        <div className="analysis-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Subject Mastery & Curricular Breakdown</h3>
              <p className="panel-subtitle">Comparative performance metrics across all evaluated subjects</p>
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
                        <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
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

      {/* TAB 4: CLASS BENCHMARKS */}
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

      {/* TAB 5: STUDENT REGISTRY */}
      {activeTab === "registry" && (
        <div className="analysis-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Student Academic Registry</h3>
              <p className="panel-subtitle">
                Showing {sortedStudents.length} candidate records for session {selectedYear} ({selectedClass === "ALL" ? "All Classes" : `Class ${selectedClass}`})
              </p>
            </div>
          </div>

          {/* Mobile Card View (< 768px) */}
          <div className="mobile-student-grid">
            {sortedStudents.map((st) => (
              <div key={st.uniqueKey} className="student-card">
                <div className="student-card-header">
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 text-sm truncate">{st.name}</div>
                    <div className="text-xs text-slate-500 truncate">
                      Class {st.class} &bull; {st.admission !== "N/A" ? `Adm #${st.admission}` : `S/O ${st.father}`}
                    </div>
                  </div>
                  <span className={`badge-tag ${st.pass ? "pass" : "fail"}`}>
                    {st.pass ? "PASS" : "FAIL"}
                  </span>
                </div>

                <div className="student-card-body">
                  <div>
                    <span className="text-xs text-slate-400 block">Class Rank</span>
                    <span className="font-bold text-slate-800">{st.rankWithSuffix}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Marks Scored</span>
                    <span className="font-bold text-indigo-700">
                      {st.totalMarks} <span className="text-xs text-slate-400">/ {st.totalMax}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Percentage</span>
                    <span className="font-bold text-slate-800">{st.percentage}%</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Grade</span>
                    <span className="font-bold text-emerald-700">{st.overallGrade}</span>
                  </div>
                </div>

                <div className="student-card-footer">
                  <span className="text-xs text-slate-400">Session {selectedYear}</span>
                  <Link
                    href={`/admin/exams/session/${selectedYear}?admission=${
                      st.admission !== "N/A" ? st.admission : encodeURIComponent(st.name)
                    }`}
                    className="btn-action"
                  >
                    Print Card
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View (>= 769px) */}
          <div className="data-table-wrapper desktop-table-only">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("classRank")} className="cursor-pointer">
                    Class Rank {sortField === "classRank" && (sortOrder === "asc" ? "▲" : "▼")}
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
                  <tr key={st.uniqueKey}>
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
                        href={`/admin/exams/session/${selectedYear}?admission=${
                          st.admission !== "N/A" ? st.admission : encodeURIComponent(st.name)
                        }`}
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
                      <tr key={st.uniqueKey} className="bg-rose-50/50">
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
                            href={`/admin/exams/session/${selectedYear}?admission=${
                              st.admission !== "N/A" ? st.admission : encodeURIComponent(st.name)
                            }`}
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
