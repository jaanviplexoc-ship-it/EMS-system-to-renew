
import { Box, Card, CardContent, Typography } from "@mui/material";

export default function AttendanceChart({ data = [] }) {
    const maxValue = Math.max(
        1,
        ...data.map(
            (item) => (item.present ?? 0) + (item.absent ?? 0)
        )
    );

    const chartMax = Math.ceil(maxValue / 5) * 5 || 5;

    const yAxisLabels = [
        chartMax,
        Math.round(chartMax * 0.75),
        Math.round(chartMax * 0.5),
        Math.round(chartMax * 0.25),
        0,
    ];

    return (
        <Card
            className="dashboard-table-card"
            sx={{
                borderRadius: "16px",
                border: "1px solid #e7e9f0",
                boxShadow: "0 4px 18px rgba(31, 41, 55, 0.05)",
                backgroundColor: "#ffffff",
                overflow: "hidden",
            }}
        >
            <CardContent
                sx={{
                    p: { xs: 2, sm: 3 },
                    "&:last-child": { pb: { xs: 2, sm: 3 } },
                }}
            >
                {/* Header */}
                <Box sx={{ mb: 2.5 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            fontSize: "1.15rem",
                            color: "#24243a",
                            mb: 0.75,
                        }}
                    >
                        Weekly Attendance Overview
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            color: "#777d90",
                            lineHeight: 1.6,
                        }}
                    >
                        Daily attendance summary for the last seven days
                    </Typography>
                </Box>

                {data.length === 0 ? (
                    <Typography color="text.secondary">
                        No attendance trend available.
                    </Typography>
                ) : (
                    <>
                        {/* Legend */}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                flexWrap: "wrap",
                                columnGap: 3,
                                rowGap: 1,
                                mb: 3.5,
                            }}
                        >
                            {[
                                {
                                    label: "Present",
                                    color: "#6554c0",
                                },
                                {
                                    label: "Not marked",
                                    color: "#d9deea",
                                },
                            ].map((item) => (
                                <Box
                                    key={item.label}
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 11,
                                            height: 11,
                                            flexShrink: 0,
                                            borderRadius: "3px",
                                            bgcolor: item.color,
                                        }}
                                    />
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "#555b70",
                                            fontSize: "0.82rem",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {item.label}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>

                        {/* Chart */}
                        <Box
                            sx={{
                                display: "flex",
                                width: "100%",
                                height: { xs: 250, sm: 300 },
                            }}
                        >
                            {/* Y-axis labels */}
                            <Box
                                sx={{
                                    width: 32,
                                    flexShrink: 0,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    pb: "30px",
                                }}
                            >
                                {yAxisLabels.map((value, index) => (
                                    <Typography
                                        key={`${value}-${index}`}
                                        variant="caption"
                                        sx={{
                                            color: "#858ba0",
                                            fontSize: "0.72rem",
                                            lineHeight: 1,
                                            transform: "translateY(50%)",
                                        }}
                                    >
                                        {value}
                                    </Typography>
                                ))}
                            </Box>

                            {/* Plot and bars */}
                            <Box
                                sx={{
                                    flex: 1,
                                    minWidth: 0,
                                    display: "flex",
                                    flexDirection: "column",

                                }}
                            >
                                <Box
                                    sx={{
                                        position: "relative",
                                        flex: 1,
                                        display: "flex",
                                        alignItems: "stretch",
                                        borderBottom: "1px solid #dfe3ec",
                                        backgroundImage:
                                            "linear-gradient(to bottom, #e7eaf2 1px, transparent 1px)",
                                        backgroundSize: "100% 25%",
                                    }}
                                >
                                    {data.map((item, index) => {
                                        const present = item.present ?? 0;
                                        const absent = item.absent ?? 0;
                                        const total = present + absent;

                                        const barHeight =
                                            (total / chartMax) * 100;

                                        const presentHeight =
                                            total > 0
                                                ? (present / total) * 100
                                                : 0;

                                        return (
                                            <Box
                                                key={item.day ?? index}
                                                sx={{
                                                    width: "65%",
                                                    maxWidth: 38,
                                                    minWidth: 8,
                                                    height: `${barHeight}%`,
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    position: "relative",
                                                    overflow: "visible",
                                                    borderRadius: "7px 7px 2px 2px",
                                                    bgcolor: "#edf0f6",
                                                }}
                                            >
                                                {/* Total count */}
                                                {total > 0 && (
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            position: "absolute",
                                                            top: "-18px",
                                                            left: "50%",
                                                            transform: "translateX(-50%)",
                                                            whiteSpace: "nowrap",
                                                            fontSize: "0.75rem",
                                                            fontWeight: 700,
                                                            color: "#24243a",
                                                            lineHeight: 1,
                                                        }}
                                                    >
                                                        {total}
                                                    </Typography>
                                                )}

                                                {/* Stacked bar */}
                                                <Box
                                                    sx={{
                                                        width: "100%",
                                                        maxWidth: 38,
                                                        minWidth: 8,
                                                        height: `${barHeight}%`,
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        overflow: "hidden",
                                                        borderRadius:
                                                            "7px 7px 2px 2px",
                                                        bgcolor: "#edf0f6",
                                                        boxShadow:
                                                            "0 2px 5px rgba(35, 42, 65, 0.06)",
                                                        transition:
                                                            "height 0.25s ease",

                                                    }}
                                                >
                                                    <Box
                                                        title={`Not marked: ${absent}`}
                                                        sx={{
                                                            height: `${100 - presentHeight}%`,
                                                            bgcolor: "#d9deea",
                                                        }}
                                                    />

                                                    <Box
                                                        title={`Present: ${present}`}
                                                        sx={{
                                                            height: `${presentHeight}%`,
                                                            bgcolor: "#6554c0",
                                                        }}
                                                    />
                                                </Box>
                                            </Box>
                                        );
                                    })}
                                </Box>

                                {/* X-axis */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        pt: 1.5,
                                    }}
                                >
                                    {data.map((item, index) => (
                                        <Box
                                            key={item.day ?? index}
                                            sx={{
                                                flex: 1,
                                                minWidth: 0,
                                                textAlign: "center",
                                            }}
                                        >
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: "#70768b",
                                                    fontSize: {
                                                        xs: "0.68rem",
                                                        sm: "0.76rem",
                                                    },
                                                    fontWeight: 500,
                                                }}
                                            >
                                                {item.day}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
