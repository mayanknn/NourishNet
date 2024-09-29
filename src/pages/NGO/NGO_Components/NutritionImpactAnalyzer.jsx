import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend as RechartsLegend, ResponsiveContainer } from 'recharts';

// Register the required components for Pie chart
ChartJS.register(ArcElement, Tooltip, Legend);

const NutritionImpactAnalyzer = () => {
    const [nutritionData, setNutritionData] = useState(null);
    const [error, setError] = useState('');

    // Static values for now: food type = wheat flour, quantity = 2kg
    const ingr = '2000g wheat flour'; // 2kg wheat flour in grams

    // Fetch nutrition data from Edamam API
    useEffect(() => {
        const fetchNutritionData = async () => {
            const appId = 'f0652213';
            const appKey = '61e3431c505f867fe3da8e1142e423bb';
            const apiUrl = `https://api.edamam.com/api/nutrition-data?app_id=${appId}&app_key=${appKey}&ingr=${encodeURIComponent(ingr)}`;

            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error('Failed to fetch nutrition data');
                }
                const data = await response.json();
                setNutritionData(data);
            } catch (error) {
                setError('Error fetching data: ' + error.message);
            }
        };

        fetchNutritionData();
    }, []);

    // Format the response data for display
    const renderNutritionInfo = () => {
        if (!nutritionData) return null;

        const {
            calories,
            totalWeight,
            totalNutrients: { FAT, PROCNT, CHOCDF, FIBTG, CA, FE, VITC, VITD },
        } = nutritionData;

        return (
            <div className="nutrition-info bg-gray-800 text-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Nutritional Impact Report</h2>
                <p className="text-lg">Food: 2kg Wheat Flour</p>
                <p className="text-lg">Total Weight: {totalWeight}g</p>
                <p className="text-lg">Calories: {calories} kcal</p>
                <p className="text-lg">Proteins: {PROCNT?.quantity.toFixed(2)}g</p>
                <p className="text-lg">Fats: {FAT?.quantity.toFixed(2)}g</p>
                <p className="text-lg">Carbohydrates: {CHOCDF?.quantity.toFixed(2)}g</p>
                <p className="text-lg">Fiber: {FIBTG?.quantity.toFixed(2)}g</p>
                <p className="text-lg">Calcium: {CA?.quantity.toFixed(2)}mg</p>
                <p className="text-lg">Iron: {FE?.quantity.toFixed(2)}mg</p>
                <p className="text-lg">Vitamin C: {VITC?.quantity.toFixed(2)}mg</p>
                <p className="text-lg">Vitamin D: {VITD?.quantity.toFixed(2)}µg</p>
            </div>
        );
    };

    // Render Regular Pie Chart for Macronutrient Distribution
    const renderMacronutrientPieChart = () => {
        const macronutrientData = [
            { name: 'Proteins', value: nutritionData?.totalNutrients?.PROCNT?.quantity || 0 },
            { name: 'Fats', value: nutritionData?.totalNutrients?.FAT?.quantity || 0 },
            { name: 'Carbohydrates', value: nutritionData?.totalNutrients?.CHOCDF?.quantity || 0 },
        ];

        const data = {
            labels: macronutrientData.map(entry => entry.name),
            datasets: [
                {
                    label: 'Macronutrients',
                    data: macronutrientData.map(entry => entry.value),
                    backgroundColor: ['#8884d8', '#82ca9d', '#ffc658'],
                    hoverOffset: 4,
                },
            ],
        };

        return (
            <div className="flex justify-center items-center">
                <div style={{ width: '400px', height: '400px' }}>
                    <Pie data={data} />
                </div>
            </div>
        );
    };

    // Render Bar Chart for Micronutrients
    const renderVitaminMineralBarChart = () => {
        const vitaminMineralData = [
            { name: 'Calcium', value: nutritionData?.totalNutrients?.CA?.quantity || 0 },
            { name: 'Iron', value: nutritionData?.totalNutrients?.FE?.quantity || 0 },
            { name: 'Vitamin C', value: nutritionData?.totalNutrients?.VITC?.quantity || 0 },
            { name: 'Vitamin D', value: nutritionData?.totalNutrients?.VITD?.quantity || 0 },
        ];

        return (
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={vitaminMineralData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <RechartsLegend />
                    <Bar dataKey="value" fill="#4CAF50" />
                </BarChart>
            </ResponsiveContainer>
        );
    };

    return (
        <div className="flex flex-col items-center justify-center bg-gray-900" style={{width:'100vw',position:'relative',left:'0',overflow:'scroll'}}>
            {error ? (
                <p className="text-red-500 text-lg">{error}</p>
            ) : nutritionData ? (
                <>
                    {renderNutritionInfo()}
                    <div className="my-8">
                        <h1 className="text-2xl text-white mb-4">Macronutrients Distribution</h1>
                        {renderMacronutrientPieChart()}
                    </div>
                    <div className="my-8" style={{ width: '50vw' }}>
                        <h1 className="text-2xl text-white mb-4">Micronutrients Levels</h1>
                        {renderVitaminMineralBarChart()}
                    </div>
                </>
            ) : (
                <p className="text-gray-300 text-lg">Fetching nutritional data...</p>
            )}
        </div>
    );
};

export default NutritionImpactAnalyzer;
