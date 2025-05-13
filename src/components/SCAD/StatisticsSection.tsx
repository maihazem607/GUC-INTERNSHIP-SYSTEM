import React, { useState } from 'react';
import styles from './StatisticsSection.module.css';
import StatsCard from './StatsCard';
import { BarChart, PieChart, LineChart, FilePlus, Download } from 'lucide-react';

// Types for the statistics data
export interface StatisticsData {
  reports: {
    accepted: number;
    rejected: number;
    flagged: number;
    total: number;
    trend?: { value: number; isPositive: boolean };
  };
  reviewTime: {
    average: string;
    trend?: { value: number; isPositive: boolean };
  };
  courses: {
    topCourses: Array<{ name: string; count: number }>;
    trend?: { value: number; isPositive: boolean };
  };
  companies: {
    topRated: Array<{ name: string; rating: number }>;
    trend?: { value: number; isPositive: boolean };
  };
  internships: {
    topCompanies: Array<{ name: string; count: number }>;
    total: number;
    trend?: { value: number; isPositive: boolean };
  };
}

interface StatisticsSectionProps {
  data: StatisticsData;
  onGenerateReport?: () => void;
}

const StatisticsSection: React.FC<StatisticsSectionProps> = ({ data, onGenerateReport }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'companies' | 'courses'>('overview');
  const [chartView, setChartView] = useState<'bar' | 'pie' | 'line'>('bar');

  // Function to render the chart based on active tab and chart view
  const renderChart = () => {
    if (activeTab === 'overview') {
      return (
        <div className={styles.overviewCharts}>          <div className={styles.chartContainer}>
            <h3 className={styles.chartTitle}>Reports Status</h3>
            <div className={styles.chartPlaceholder}>
              {chartView === 'bar' && (
                <div className={styles.barChart}>
                  <div className={styles.barGroup}>
                    <div 
                      className={`${styles.bar} ${styles.accepted}`} 
                      style={{
                        height: `${Math.max((data.reports.accepted / (data.reports.accepted + data.reports.rejected + data.reports.flagged)) * 200 + 20, 30)}px`,
                      }}
                    >
                      <span className={styles.barValue}>{data.reports.accepted}</span>
                    </div>
                    <span className={styles.barLabel}>Accepted</span>
                  </div>
                  <div className={styles.barGroup}>
                    <div 
                      className={`${styles.bar} ${styles.rejected}`} 
                      style={{
                        height: `${Math.max((data.reports.rejected / (data.reports.accepted + data.reports.rejected + data.reports.flagged)) * 200 + 20, 30)}px`,
                      }}
                    >
                      <span className={styles.barValue}>{data.reports.rejected}</span>
                    </div>
                    <span className={styles.barLabel}>Rejected</span>
                  </div>
                  <div className={styles.barGroup}>
                    <div 
                      className={`${styles.bar} ${styles.flagged}`} 
                      style={{
                        height: `${Math.max((data.reports.flagged / (data.reports.accepted + data.reports.rejected + data.reports.flagged)) * 200 + 20, 30)}px`,
                      }}
                    >
                      <span className={styles.barValue}>{data.reports.flagged}</span>
                    </div>
                    <span className={styles.barLabel}>Flagged</span>
                  </div>
                </div>
              )}              {chartView === 'pie' && (                <div className={styles.pieChartPlaceholder}>
                  <div className={styles.pieChart}>
                    {/* Calculate total for proportions */}
                    {(() => {
                      const total = data.reports.accepted + data.reports.rejected + data.reports.flagged;
                      
                      // Calculate angles for each segment (in radians)
                      const acceptedAngle = (data.reports.accepted / total) * Math.PI * 2;
                      const rejectedAngle = (data.reports.rejected / total) * Math.PI * 2;
                      const flaggedAngle = (data.reports.flagged / total) * Math.PI * 2;
                      
                      // Calculate percentages for labels
                      const acceptedPercent = ((data.reports.accepted / total) * 100).toFixed(1);
                      const rejectedPercent = ((data.reports.rejected / total) * 100).toFixed(1);
                      const flaggedPercent = ((data.reports.flagged / total) * 100).toFixed(1);
                      
                      // Starting angle is at the top (270 degrees or -90 degrees or -π/2 radians)
                      let startAngle = -Math.PI / 2;
                      
                      // Create the segments in order: largest to smallest for better visualization
                      const segments = [
                        { value: data.reports.accepted, angle: acceptedAngle, color: "#22c55e", label: "Accepted", percent: acceptedPercent },
                        { value: data.reports.rejected, angle: rejectedAngle, color: "#ef4444", label: "Rejected", percent: rejectedPercent },
                        { value: data.reports.flagged, angle: flaggedAngle, color: "#eab308", label: "Flagged", percent: flaggedPercent }
                      ].sort((a, b) => b.value - a.value);
                      
                      return (
                        <svg width="180" height="180" viewBox="0 0 100 100">
                          {segments.map((segment, index) => {
                            // Calculate the path for this segment
                            const endAngle = startAngle + segment.angle;
                            const largeArcFlag = segment.angle > Math.PI ? 1 : 0;
                            
                            // Calculate the points on the circle
                            const startX = 50 + 40 * Math.cos(startAngle);
                            const startY = 50 + 40 * Math.sin(startAngle);
                            const endX = 50 + 40 * Math.cos(endAngle);
                            const endY = 50 + 40 * Math.sin(endAngle);
                            
                            // Create path
                            const path = `M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
                            
                            // Position for the percentage label
                            const labelAngle = startAngle + (segment.angle / 2);
                            const labelRadius = 26; // Position the label between center and edge
                            const labelX = 50 + labelRadius * Math.cos(labelAngle);
                            const labelY = 50 + labelRadius * Math.sin(labelAngle);
                            
                            // Update the starting angle for the next segment
                            const currentStartAngle = startAngle;
                            startAngle = endAngle;
                            
                            return (
                              <g key={index}>
                                <path d={path} fill={segment.color} />
                                {segment.value > 0 && segment.angle > 0.2 && (
                                  <text 
                                    x={labelX} 
                                    y={labelY} 
                                    textAnchor="middle" 
                                    dominantBaseline="middle"
                                    fill="white"
                                    fontSize="8"
                                    fontWeight="bold"
                                  >
                                    {segment.percent}%
                                  </text>
                                )}
                              </g>
                            );
                          })}
                        </svg>
                      );
                    })()}
                  </div>
                  <div className={styles.pieChartLegend}>
                    <div className={styles.legendItem}>
                      <div className={`${styles.legendColor} ${styles.accepted}`}></div>
                      <span>Accepted ({data.reports.accepted})</span>
                    </div>
                    <div className={styles.legendItem}>
                      <div className={`${styles.legendColor} ${styles.rejected}`}></div>
                      <span>Rejected ({data.reports.rejected})</span>
                    </div>
                    <div className={styles.legendItem}>
                      <div className={`${styles.legendColor} ${styles.flagged}`}></div>
                      <span>Flagged ({data.reports.flagged})</span>
                    </div>
                  </div>
                </div>
              )}              {chartView === 'line' && (
                <div className={styles.lineChartPlaceholder}>
                  <div className={styles.lineChart}>
                    {/* X axis */}
                    <div className={styles.lineChartAxisX}></div>
                    {/* Y axis */}
                    <div className={styles.lineChartAxisY}></div>
                    
                    {/* SVG Line Chart */}
                    <svg width="100%" height="100%" viewBox="0 0 300 200">
                      {/* Grid lines */}
                      <g stroke="#e2e8f0" strokeWidth="0.5">
                        <line x1="0" y1="40" x2="300" y2="40" />
                        <line x1="0" y1="80" x2="300" y2="80" />
                        <line x1="0" y1="120" x2="300" y2="120" />
                        <line x1="0" y1="160" x2="300" y2="160" />
                        
                        <line x1="50" y1="0" x2="50" y2="200" />
                        <line x1="100" y1="0" x2="100" y2="200" />
                        <line x1="150" y1="0" x2="150" y2="200" />
                        <line x1="200" y1="0" x2="200" y2="200" />
                        <line x1="250" y1="0" x2="250" y2="200" />
                      </g>
                      
                      {/* Data line for report acceptance rate over time */}
                      <path 
                        d="M20,160 L60,120 L100,140 L140,100 L180,80 L220,60 L260,40" 
                        className={styles.lineChartLine}
                      />
                      
                      {/* Data area below line */}
                      <path 
                        d="M20,160 L60,120 L100,140 L140,100 L180,80 L220,60 L260,40 L260,200 L20,200 Z" 
                        className={styles.lineChartArea}
                      />
                      
                      {/* Data points */}
                      <circle cx="20" cy="160" r="4" className={styles.lineChartDot} />
                      <circle cx="60" cy="120" r="4" className={styles.lineChartDot} />
                      <circle cx="100" cy="140" r="4" className={styles.lineChartDot} />
                      <circle cx="140" cy="100" r="4" className={styles.lineChartDot} />
                      <circle cx="180" cy="80" r="4" className={styles.lineChartDot} />
                      <circle cx="220" cy="60" r="4" className={styles.lineChartDot} />
                      <circle cx="260" cy="40" r="4" className={styles.lineChartDot} />
                      
                      {/* X-axis labels */}
                      <text x="20" y="190" className={styles.lineChartLabel} textAnchor="middle">Jan</text>
                      <text x="60" y="190" className={styles.lineChartLabel} textAnchor="middle">Feb</text>
                      <text x="100" y="190" className={styles.lineChartLabel} textAnchor="middle">Mar</text>
                      <text x="140" y="190" className={styles.lineChartLabel} textAnchor="middle">Apr</text>
                      <text x="180" y="190" className={styles.lineChartLabel} textAnchor="middle">May</text>
                      <text x="220" y="190" className={styles.lineChartLabel} textAnchor="middle">Jun</text>
                      <text x="260" y="190" className={styles.lineChartLabel} textAnchor="middle">Jul</text>
                      
                      {/* Y-axis labels */}
                      <text x="10" y="160" className={styles.lineChartLabel} textAnchor="middle">0%</text>
                      <text x="10" y="120" className={styles.lineChartLabel} textAnchor="middle">25%</text>
                      <text x="10" y="80" className={styles.lineChartLabel} textAnchor="middle">50%</text>
                      <text x="10" y="40" className={styles.lineChartLabel} textAnchor="middle">75%</text>
                    </svg>
                  </div>
                  <p>Report acceptance rate trends over months</p>
                </div>
              )}
            </div>
          </div>
          <div className={styles.chartContainer}>
            <h3 className={styles.chartTitle}>Top Rated Companies</h3>
            <div className={styles.ratingChart}>
              {data.companies.topRated.slice(0, 5).map((company, index) => (
                <div key={index} className={styles.ratingBar}>
                  <div className={styles.ratingCompany}>{company.name}</div>
                  <div className={styles.ratingBarContainer}>
                    <div 
                      className={styles.ratingBarFill} 
                      style={{ width: `${(company.rating / 10) * 100}%` }}
                    ></div>
                  </div>
                  <div className={styles.ratingValue}>{company.rating.toFixed(1)}/10</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    if (activeTab === 'reports') {
      return (
        <div className={styles.reportStatsContainer}>          <div className={styles.chartContainer}>
            <h3 className={styles.chartTitle}>Report Status Distribution</h3>
            <div className={styles.chartPlaceholder}>
              {chartView === 'bar' && (
                <div className={styles.barChart}>
                  <div className={styles.barGroup}>
                    <div 
                      className={`${styles.bar} ${styles.accepted}`} 
                      style={{
                        height: `${Math.max((data.reports.accepted / (data.reports.accepted + data.reports.rejected + data.reports.flagged)) * 200 + 20, 30)}px`,
                      }}
                    >
                      <span className={styles.barValue}>{data.reports.accepted}</span>
                    </div>
                    <span className={styles.barLabel}>Accepted</span>
                  </div>
                  <div className={styles.barGroup}>
                    <div 
                      className={`${styles.bar} ${styles.rejected}`} 
                      style={{
                        height: `${Math.max((data.reports.rejected / (data.reports.accepted + data.reports.rejected + data.reports.flagged)) * 200 + 20, 30)}px`,
                      }}
                    >
                      <span className={styles.barValue}>{data.reports.rejected}</span>
                    </div>
                    <span className={styles.barLabel}>Rejected</span>
                  </div>
                  <div className={styles.barGroup}>
                    <div 
                      className={`${styles.bar} ${styles.flagged}`} 
                      style={{
                        height: `${Math.max((data.reports.flagged / (data.reports.accepted + data.reports.rejected + data.reports.flagged)) * 200 + 20, 30)}px`,
                      }}
                    >
                      <span className={styles.barValue}>{data.reports.flagged}</span>
                    </div>
                    <span className={styles.barLabel}>Flagged</span>
                  </div>
                </div>
              )}
              {chartView === 'pie' && (
                <div className={styles.pieChartPlaceholder}>
                  <div className={styles.pieChart}>
                    {/* Calculate total for proportions */}
                    {(() => {
                      const total = data.reports.accepted + data.reports.rejected + data.reports.flagged;
                      
                      // Calculate angles for each segment (in radians)
                      const acceptedAngle = (data.reports.accepted / total) * Math.PI * 2;
                      const rejectedAngle = (data.reports.rejected / total) * Math.PI * 2;
                      const flaggedAngle = (data.reports.flagged / total) * Math.PI * 2;
                      
                      // Calculate percentages for labels
                      const acceptedPercent = ((data.reports.accepted / total) * 100).toFixed(1);
                      const rejectedPercent = ((data.reports.rejected / total) * 100).toFixed(1);
                      const flaggedPercent = ((data.reports.flagged / total) * 100).toFixed(1);
                      
                      // Starting angle is at the top (270 degrees or -90 degrees or -π/2 radians)
                      let startAngle = -Math.PI / 2;
                      
                      // Create the segments in order: largest to smallest for better visualization
                      const segments = [
                        { value: data.reports.accepted, angle: acceptedAngle, color: "#22c55e", label: "Accepted", percent: acceptedPercent },
                        { value: data.reports.rejected, angle: rejectedAngle, color: "#ef4444", label: "Rejected", percent: rejectedPercent },
                        { value: data.reports.flagged, angle: flaggedAngle, color: "#eab308", label: "Flagged", percent: flaggedPercent }
                      ].sort((a, b) => b.value - a.value);
                      
                      return (
                        <svg width="180" height="180" viewBox="0 0 100 100">
                          {segments.map((segment, index) => {
                            // Calculate the path for this segment
                            const endAngle = startAngle + segment.angle;
                            const largeArcFlag = segment.angle > Math.PI ? 1 : 0;
                            
                            // Calculate the points on the circle
                            const startX = 50 + 40 * Math.cos(startAngle);
                            const startY = 50 + 40 * Math.sin(startAngle);
                            const endX = 50 + 40 * Math.cos(endAngle);
                            const endY = 50 + 40 * Math.sin(endAngle);
                            
                            // Create path
                            const path = `M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
                            
                            // Position for the percentage label
                            const labelAngle = startAngle + (segment.angle / 2);
                            const labelRadius = 26; // Position the label between center and edge
                            const labelX = 50 + labelRadius * Math.cos(labelAngle);
                            const labelY = 50 + labelRadius * Math.sin(labelAngle);
                            
                            // Update the starting angle for the next segment
                            const currentStartAngle = startAngle;
                            startAngle = endAngle;
                            
                            return (
                              <g key={index}>
                                <path d={path} fill={segment.color} />
                                {segment.value > 0 && segment.angle > 0.2 && (
                                  <text 
                                    x={labelX} 
                                    y={labelY} 
                                    textAnchor="middle" 
                                    dominantBaseline="middle"
                                    fill="white"
                                    fontSize="8"
                                    fontWeight="bold"
                                  >
                                    {segment.percent}%
                                  </text>
                                )}
                              </g>
                            );
                          })}
                        </svg>
                      );
                    })()}
                  </div>
                  <div className={styles.pieChartLegend}>
                    <div className={styles.legendItem}>
                      <div className={`${styles.legendColor} ${styles.accepted}`}></div>
                      <span>Accepted ({data.reports.accepted})</span>
                    </div>
                    <div className={styles.legendItem}>
                      <div className={`${styles.legendColor} ${styles.rejected}`}></div>
                      <span>Rejected ({data.reports.rejected})</span>
                    </div>
                    <div className={styles.legendItem}>
                      <div className={`${styles.legendColor} ${styles.flagged}`}></div>
                      <span>Flagged ({data.reports.flagged})</span>
                    </div>
                  </div>
                </div>
              )}
              {chartView === 'line' && (
                <div className={styles.lineChartPlaceholder}>
                  <div className={styles.lineChart}>
                    {/* X axis */}
                    <div className={styles.lineChartAxisX}></div>
                    {/* Y axis */}
                    <div className={styles.lineChartAxisY}></div>
                    
                    {/* SVG Line Chart */}
                    <svg width="100%" height="100%" viewBox="0 0 300 200">
                      {/* Grid lines */}
                      <g stroke="#e2e8f0" strokeWidth="0.5">
                        <line x1="0" y1="40" x2="300" y2="40" />
                        <line x1="0" y1="80" x2="300" y2="80" />
                        <line x1="0" y1="120" x2="300" y2="120" />
                        <line x1="0" y1="160" x2="300" y2="160" />
                        
                        <line x1="50" y1="0" x2="50" y2="200" />
                        <line x1="100" y1="0" x2="100" y2="200" />
                        <line x1="150" y1="0" x2="150" y2="200" />
                        <line x1="200" y1="0" x2="200" y2="200" />
                        <line x1="250" y1="0" x2="250" y2="200" />
                      </g>
                      
                      {/* Data line for report acceptance rate over time */}
                      <path 
                        d="M20,160 L60,120 L100,140 L140,100 L180,80 L220,60 L260,40" 
                        className={styles.lineChartLine}
                      />
                      
                      {/* Data area below line */}
                      <path 
                        d="M20,160 L60,120 L100,140 L140,100 L180,80 L220,60 L260,40 L260,200 L20,200 Z" 
                        className={styles.lineChartArea}
                      />
                      
                      {/* Data points */}
                      <circle cx="20" cy="160" r="4" className={styles.lineChartDot} />
                      <circle cx="60" cy="120" r="4" className={styles.lineChartDot} />
                      <circle cx="100" cy="140" r="4" className={styles.lineChartDot} />
                      <circle cx="140" cy="100" r="4" className={styles.lineChartDot} />
                      <circle cx="180" cy="80" r="4" className={styles.lineChartDot} />
                      <circle cx="220" cy="60" r="4" className={styles.lineChartDot} />
                      <circle cx="260" cy="40" r="4" className={styles.lineChartDot} />
                      
                      {/* X-axis labels */}
                      <text x="20" y="190" className={styles.lineChartLabel} textAnchor="middle">Jan</text>
                      <text x="60" y="190" className={styles.lineChartLabel} textAnchor="middle">Feb</text>
                      <text x="100" y="190" className={styles.lineChartLabel} textAnchor="middle">Mar</text>
                      <text x="140" y="190" className={styles.lineChartLabel} textAnchor="middle">Apr</text>
                      <text x="180" y="190" className={styles.lineChartLabel} textAnchor="middle">May</text>
                      <text x="220" y="190" className={styles.lineChartLabel} textAnchor="middle">Jun</text>
                      <text x="260" y="190" className={styles.lineChartLabel} textAnchor="middle">Jul</text>
                      
                      {/* Y-axis labels */}
                      <text x="10" y="160" className={styles.lineChartLabel} textAnchor="middle">0%</text>
                      <text x="10" y="120" className={styles.lineChartLabel} textAnchor="middle">25%</text>
                      <text x="10" y="80" className={styles.lineChartLabel} textAnchor="middle">50%</text>
                      <text x="10" y="40" className={styles.lineChartLabel} textAnchor="middle">75%</text>
                    </svg>
                  </div>
                  <p>Report acceptance rate trends over months</p>
                </div>
              )}
            </div>
          </div>
          <div className={styles.statsDetails}>
            <h3 className={styles.detailsTitle}>Report Review Details</h3>
            <div className={styles.detailsItem}>
              <span className={styles.detailLabel}>Average Review Time:</span>
              <span className={styles.detailValue}>{data.reviewTime.average}</span>
            </div>
            <div className={styles.detailsItem}>
              <span className={styles.detailLabel}>Total Reports:</span>
              <span className={styles.detailValue}>{data.reports.total}</span>
            </div>
            <div className={styles.detailsItem}>
              <span className={styles.detailLabel}>Acceptance Rate:</span>
              <span className={styles.detailValue}>{((data.reports.accepted / data.reports.total) * 100).toFixed(1)}%</span>
            </div>
            <div className={styles.detailsItem}>
              <span className={styles.detailLabel}>Rejection Rate:</span>
              <span className={styles.detailValue}>{((data.reports.rejected / data.reports.total) * 100).toFixed(1)}%</span>
            </div>
            <div className={styles.detailsItem}>
              <span className={styles.detailLabel}>Flag Rate:</span>
              <span className={styles.detailValue}>{((data.reports.flagged / data.reports.total) * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      );
    }
    
    if (activeTab === 'companies') {
      return (
        <div className={styles.companiesContainer}>
          <div className={styles.chartContainer}>
            <h3 className={styles.chartTitle}>Top Companies by Internship Count</h3>
            <div className={styles.horizontalBars}>
              {data.internships.topCompanies.slice(0, 7).map((company, index) => (
                <div key={index} className={styles.horizontalBar}>
                  <div className={styles.horizontalBarLabel}>{company.name}</div>
                  <div className={styles.horizontalBarTrack}>
                    <div 
                      className={styles.horizontalBarFill} 
                      style={{ 
                        width: `${(company.count / Math.max(...data.internships.topCompanies.map(c => c.count))) * 100}%` 
                      }}
                    ></div>
                    <span className={styles.horizontalBarValue}>{company.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.chartContainer}>
            <h3 className={styles.chartTitle}>Top Rated Companies</h3>
            <div className={styles.ratingChart}>
              {data.companies.topRated.slice(0, 5).map((company, index) => (
                <div key={index} className={styles.ratingBar}>
                  <div className={styles.ratingCompany}>{company.name}</div>
                  <div className={styles.ratingBarContainer}>
                    <div 
                      className={styles.ratingBarFill} 
                      style={{ width: `${(company.rating / 10) * 100}%` }}
                    ></div>
                  </div>
                  <div className={styles.ratingValue}>{company.rating.toFixed(1)}/10</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    if (activeTab === 'courses') {
      return (
        <div className={styles.coursesContainer}>
          <div className={styles.chartContainer}>
            <h3 className={styles.chartTitle}>Most Frequently Used Courses</h3>
            <div className={styles.horizontalBars}>
              {data.courses.topCourses.slice(0, 7).map((course, index) => (
                <div key={index} className={styles.horizontalBar}>
                  <div className={styles.horizontalBarLabel}>{course.name}</div>
                  <div className={styles.horizontalBarTrack}>
                    <div 
                      className={styles.horizontalBarFill} 
                      style={{ 
                        width: `${(course.count / Math.max(...data.courses.topCourses.map(c => c.count))) * 100}%` 
                      }}
                    ></div>
                    <span className={styles.horizontalBarValue}>{course.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.courseInsights}>
            <h3 className={styles.insightsTitle}>Course Insights</h3>
            <p className={styles.insightsText}>
              The courses listed above are the most commonly utilized in internships. 
              This data can help guide curriculum decisions and student advisement to better 
              prepare students for in-demand skills in the job market.
            </p>
            <p className={styles.insightsText}>
              Consider creating focused workshops or additional resources for the top courses 
              to help students excel in these areas.
            </p>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className={styles.statisticsSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Internship Cycle Statistics</h2>
        <div className={styles.sectionActions}>
          <button 
            className={styles.reportButton} 
            onClick={onGenerateReport}
          >
            <FilePlus size={18} />
            <span>Generate Report</span>
          </button>
          <button className={styles.downloadButton}>
            <Download size={18} />
            <span>Export Data</span>
          </button>
        </div>
      </div>
      
      <div className={styles.statsCards}>
        <StatsCard 
          title="Report Status"
          value={data.reports.total}
          subtitle={`${data.reports.accepted} Accepted / ${data.reports.rejected} Rejected / ${data.reports.flagged} Flagged`}
          type="reports"
          trend={data.reports.trend}
          onClick={() => setActiveTab('reports')}
        />
        <StatsCard 
          title="Average Review Time"
          value={data.reviewTime.average}
          type="reviewTime"
          trend={data.reviewTime.trend}
          onClick={() => setActiveTab('reports')}
        />
        <StatsCard 
          title="Top Course"
          value={data.courses.topCourses[0]?.name || 'N/A'}
          subtitle={`Used in ${data.courses.topCourses[0]?.count || 0} internships`}
          type="courses"
          trend={data.courses.trend}
          onClick={() => setActiveTab('courses')}
        />
        <StatsCard 
          title="Top Rated Company"
          value={data.companies.topRated[0]?.name || 'N/A'}
          subtitle={`Rating: ${data.companies.topRated[0]?.rating.toFixed(1) || 0}/10`}
          type="companies"
          trend={data.companies.trend}
          onClick={() => setActiveTab('companies')}
        />
        <StatsCard 
          title="Internship Count"
          value={data.internships.total}
          subtitle={`${data.internships.topCompanies[0]?.name || 'N/A'} leads with ${data.internships.topCompanies[0]?.count || 0}`}
          type="internships"
          trend={data.internships.trend}
          onClick={() => setActiveTab('companies')}
        />
      </div>
      
      <div className={styles.chartSection}>
        <div className={styles.chartNav}>
          <div className={styles.tabs}>
            <button 
              className={`${styles.tabButton} ${activeTab === 'overview' ? styles.active : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'reports' ? styles.active : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              Reports
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'companies' ? styles.active : ''}`}
              onClick={() => setActiveTab('companies')}
            >
              Companies
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'courses' ? styles.active : ''}`}
              onClick={() => setActiveTab('courses')}
            >
              Courses
            </button>
          </div>
          <div className={styles.chartControls}>
            <button 
              className={`${styles.chartButton} ${chartView === 'bar' ? styles.active : ''}`}
              onClick={() => setChartView('bar')}
              title="Bar Chart"
            >
              <BarChart size={16} />
            </button>
            <button 
              className={`${styles.chartButton} ${chartView === 'pie' ? styles.active : ''}`}
              onClick={() => setChartView('pie')}
              title="Pie Chart"
            >
              <PieChart size={16} />
            </button>
            <button 
              className={`${styles.chartButton} ${chartView === 'line' ? styles.active : ''}`}
              onClick={() => setChartView('line')}
              title="Line Chart"
            >
              <LineChart size={16} />
            </button>
          </div>
        </div>
        
        <div className={styles.chartContent}>
          {renderChart()}
        </div>
      </div>
    </div>
  );
};

export default StatisticsSection;