// temporary for a basic idea

import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { useParams } from "react-router-dom";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

const grades = ['A', 'AB', 'B', 'BC', 'C', 'CD', 'D', 'F'];
const marksRange = Array.from({ length: 11 }, (_, i) => i * 10); // [0, 10, 20, ..., 100]

// Example analysisData with sample marks
const analysisData = [
  { grade: 'A', marks: [85, 90, 92] },
  { grade: 'AB', marks: [80, 82] },
  { grade: 'B', marks: [70, 75] },
  { grade: 'BC', marks: [60, 65] },
  { grade: 'C', marks: [50, 55] },
  { grade: 'CD', marks: [40, 45] },
  { grade: 'D', marks: [30, 35] },
  { grade: 'F', marks: [0, 20, 25] },
];

const prepareChartData = (analysisData) => {
    return grades.map((grade) => {
      const marksCount = marksRange.map((mark) => {
        return {
          grade: grade,
          marks: analysisData.filter((data) => data.grade === grade)
            .flatMap((data) => data.marks)
            .filter((m) => m >= mark && m < mark + 10).length,
        };
      });
      return marksCount;
    }).flat();
  };
  
  

  export default function MarksVsGradeAnalysis() {
    const [chartData, setChartData] = useState(analysisData);
    const grades = ['A', 'AB', 'B', 'BC', 'C', 'CD', 'D', 'F'];
    const marksRange = Array.from({ length: 11 }, (_, i) => i * 10); // [0, 10, 20, ..., 100]
  
    useEffect(() => {
      const fetchAnalysisData = async () => {
        try {
          const response = await fetch(`${BACKEND}/api/analysis/courseId/semester`); // Update with actual IDs
          if (response.ok) {
            const result = await response.json();
            const data = prepareChartData(result.data); // Assuming result.data is in the required format
            setChartData(data);
          }
        } catch (error) {
          console.error("Error fetching analysis data:", error);
        }
      };
  
      fetchAnalysisData();
    }, []);
  
    const prepareChartData = (data) => {
      const gradeCount = marksRange.map((mark) => {
        return grades.map((grade) => {
          const count = data.filter((d) => d.grade === grade)
            .flatMap((d) => d.marks)
            .filter((m) => m >= mark && m < mark + 10).length;
          return { grade, marks: count, mark: `${mark}-${mark + 10}` };
        });
      }).flat();
      return gradeCount;
    };
  
    return (
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-4">Marks vs Grade Analysis</h2>
        <BarChart
          width={600}
          height={300}
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="grade" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="marks" fill="#8884d8" />
        </BarChart>
      </div>
    );
  }
