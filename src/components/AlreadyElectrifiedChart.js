import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const electrifiedColor = "rgb(163, 215, 164)"
const fossilColor = "rgb(255, 87, 34)"
const AlreadyElectrifiedChart = ({ label, electrifiedPct, fossilPct, otherPct }) => {

    if (electrifiedPct !== 0 || fossilPct !== 0) {
        return (
            <svg width={"100%"} height="50px" viewBox="0 0 300 15" xmlns="http://www.w3.org/2000/svg" style={{ margin: '2em 0' }}>
                <rect x={0} y={'50%'} width={`${electrifiedPct}%`} height="50%" fill={electrifiedColor} />
                <rect x={`${electrifiedPct}%`} y={'50%'} width={`${fossilPct}%`} height="50%" fill={fossilColor} />
                <text x={0} y={'35%'} fontSize="10px">Electrified</text>
                <text x={'100%'} y={'35%'} fontSize="10px" textAnchor="end">Not yet</text>
            </svg>
        )
    } else {
        return null
    }
}

export default React.memo(AlreadyElectrifiedChart)
