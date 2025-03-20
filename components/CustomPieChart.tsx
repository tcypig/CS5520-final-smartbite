import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { PieChart } from 'react-native-chart-kit';
import { Svg, Circle } from 'react-native-svg';
import { ThemeContext } from '@/ThemeContext';

interface PieChartProps {
  chartData: { name: string, value: number, color: string }[];
}

export default function CustomPieChart({chartData}: PieChartProps) {
  const { theme } = React.useContext(ThemeContext);
  const [currentTheme, setCurrentTheme] = useState(theme);

  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);
  
  return (
    <View>
      <PieChart
        data={chartData.map(({ name, value, color }) => ({
          name,
          population: value,
          color,
          legendFontColor: currentTheme.text,
          legendFontSize: 14,
        }))}
        width={300}
        height={200}
        chartConfig={{ 
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, 
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  caloriesContainer: {
    position: 'absolute',
    top: 80,
    left: 135,
    alignItems: 'center',
  },
  caloriesText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  unitText: {
    fontSize: 12,
    color: 'gray',
  },
})