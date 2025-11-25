import React, { useState, useMemo } from 'react';
import { Layout } from './components/layout/Layout';
import { Controls } from './components/dashboard/Controls';
import { OverallScore } from './components/dashboard/OverallScore';
import { RadarAnalysis } from './components/dashboard/RadarAnalysis';
import { DomainGauges } from './components/dashboard/DomainGauges';
import { BenchmarkComparison } from './components/dashboard/BenchmarkComparison';
import { GapAnalysis } from './components/dashboard/GapAnalysis';
import { PeerComparison } from './components/dashboard/PeerComparison';
import { Button } from './components/ui/Button';
import { Settings2 } from 'lucide-react';
import { INDUSTRY_BENCHMARKS, COLORS } from './data/constants';
import { getMaturityLevel } from './utils/helpers';
import { exportToImage } from './utils/export';

function App() {
  // State
  const [showControls, setShowControls] = useState(true);
  const selectedIndustry = 'financial'; // Locked to Financial Services
  const [activeVisualization, setActiveVisualization] = useState('overview');
  const [chartStyle, setChartStyle] = useState('modern');

  const [domainScores, setDomainScores] = useState({
    visibility: {
      name: 'Visibility & Telemetry',
      description: 'Logging, endpoint coverage, asset inventory, cloud visibility',
      weight: 30,
      score: 45,
      subdomains: {
        logging: 72,
        endpointCoverage: 68,
        assetInventory: 25,
        cloudVisibility: 15
      }
    },
    detection: {
      name: 'Detection & Analytics',
      description: 'SIEM rules, EDR detection, ML analytics, alert fidelity',
      weight: 30,
      score: 65,
      subdomains: {
        siemRules: 78,
        edrDetection: 82,
        mlAnalytics: 45,
        alertFidelity: 55
      }
    },
    response: {
      name: 'Response & Containment',
      description: 'MTTR, playbooks, automation, containment coverage',
      weight: 25,
      score: 58,
      subdomains: {
        mttr: 52,
        playbooks: 65,
        automation: 48,
        containment: 67
      }
    },
    exposure: {
      name: 'Cloud, Identity & Vuln Mgmt',
      description: 'CSPM, IAM hygiene, VM lifecycle, attack surface exposure',
      weight: 15,
      score: 32,
      subdomains: {
        cspm: 18,
        iamHygiene: 42,
        vmLifecycle: 28,
        attackSurface: 40
      }
    }
  });

  // Actions
  const updateSubdomainScore = (domain, subdomain, value) => {
    setDomainScores(prev => {
      const newScores = { ...prev };
      newScores[domain].subdomains[subdomain] = parseInt(value);
      const subdomainValues = Object.values(newScores[domain].subdomains);
      newScores[domain].score = Math.round(
        subdomainValues.reduce((a, b) => a + b, 0) / subdomainValues.length
      );
      return newScores;
    });
  };

  const updateDomainWeight = (domainKey, newWeight) => {
    setDomainScores(prev => {
      const newScores = { ...prev };
      newScores[domainKey].weight = Math.max(0, Math.min(100, newWeight));
      return newScores;
    });
  };

  // Derived Data
  const overallScore = useMemo(() => {
    return Math.round(
      Object.values(domainScores).reduce((acc, domain) => {
        return acc + (domain.score * domain.weight / 100);
      }, 0)
    );
  }, [domainScores]);

  const maturityLevel = getMaturityLevel(overallScore);
  const industryBenchmark = INDUSTRY_BENCHMARKS[selectedIndustry];

  const radarData = Object.entries(domainScores).map(([key, domain]) => ({
    domain: domain.name.split(' ')[0],
    fullName: domain.name,
    score: domain.score,
    benchmark: INDUSTRY_BENCHMARKS[selectedIndustry].avg,
    topPerformer: INDUSTRY_BENCHMARKS[selectedIndustry].top
  }));

  const barData = Object.entries(domainScores).map(([key, domain]) => ({
    name: domain.name.split('&')[0].trim(),
    fullName: domain.name,
    score: domain.score,
    industryAvg: INDUSTRY_BENCHMARKS[selectedIndustry].avg,
    gap: Math.max(0, INDUSTRY_BENCHMARKS[selectedIndustry].avg - domain.score)
  }));

  const gapAnalysisData = [];
  Object.entries(domainScores).forEach(([domainKey, domain]) => {
    Object.entries(domain.subdomains).forEach(([subKey, value]) => {
      gapAnalysisData.push({
        capability: subKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        domain: domain.name.split('&')[0].trim(),
        current: value,
        target: 75,
        gap: Math.max(0, 75 - value),
        priority: 75 - value > 40 ? 'Critical' : 75 - value > 20 ? 'High' : 'Medium'
      });
    });
  });
  gapAnalysisData.sort((a, b) => b.gap - a.gap);

  const peerData = [
    { name: 'Your Company', score: overallScore, fill: COLORS.primary },
    { name: 'Industry Top 25%', score: industryBenchmark.top, fill: COLORS.success },
    { name: 'Industry Average', score: industryBenchmark.avg, fill: COLORS.warning },
    { name: 'Industry Bottom 25%', score: industryBenchmark.bottom, fill: COLORS.danger }
  ];

  // Custom Titles State
  const [customTitles, setCustomTitles] = useState({
    radar: 'Multi-Layer Radar Analysis',
    gauges: 'Domain Maturity Gauges',
    bars: 'Capability Benchmark Comparison',
    gaps: 'Gap Analysis & Priorities',
    peers: 'Peer Comparison',
    overall: 'Security Maturity Score'
  });

  const updateTitle = (key, newTitle) => {
    setCustomTitles(prev => ({ ...prev, [key]: newTitle }));
  };

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Controls */}
        <div className={`transition-all duration-300 ${showControls ? 'w-80 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
          <Controls
            show={showControls}
            domainScores={domainScores}
            updateSubdomainScore={updateSubdomainScore}
            updateDomainWeight={updateDomainWeight}
            activeVisualization={activeVisualization}
            setActiveVisualization={setActiveVisualization}
            chartStyle={chartStyle}
            setChartStyle={setChartStyle}
          />
        </div>

        {/* Main Dashboard Area */}
        <div className="flex-1 w-full space-y-6 self-start">
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowControls(!showControls)}
              className="text-slate-400"
            >
              <Settings2 className="w-4 h-4 mr-2" />
              {showControls ? 'Hide Controls' : 'Show Controls'}
            </Button>
          </div>

          <OverallScore
            score={overallScore}
            maturityLevel={maturityLevel}
            industryBenchmark={industryBenchmark}
            domainScores={domainScores}
            exportToImage={exportToImage}
            title={customTitles.overall}
            onTitleChange={(t) => updateTitle('overall', t)}
          />

          {/* Dynamic Visualization Area */}
          <div className="min-h-[500px]">
            {activeVisualization === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RadarAnalysis
                  radarData={radarData}
                  title={customTitles.radar}
                  onTitleChange={(t) => updateTitle('radar', t)}
                />
                <BenchmarkComparison
                  barData={barData}
                  title={customTitles.bars}
                  onTitleChange={(t) => updateTitle('bars', t)}
                />
                <GapAnalysis
                  gapData={gapAnalysisData}
                  title={customTitles.gaps}
                  onTitleChange={(t) => updateTitle('gaps', t)}
                />
                <PeerComparison
                  peerData={peerData}
                  industryName={industryBenchmark.name}
                  title={customTitles.peers}
                  onTitleChange={(t) => updateTitle('peers', t)}
                />
              </div>
            )}

            {activeVisualization === 'radar' && (
              <RadarAnalysis
                radarData={radarData}
                title={customTitles.radar}
                onTitleChange={(t) => updateTitle('radar', t)}
              />
            )}

            {activeVisualization === 'gauges' && (
              <DomainGauges
                domainScores={domainScores}
                title={customTitles.gauges}
                onTitleChange={(t) => updateTitle('gauges', t)}
              />
            )}

            {activeVisualization === 'bars' && (
              <BenchmarkComparison
                barData={barData}
                title={customTitles.bars}
                onTitleChange={(t) => updateTitle('bars', t)}
              />
            )}

            {activeVisualization === 'gaps' && (
              <GapAnalysis
                gapData={gapAnalysisData}
                title={customTitles.gaps}
                onTitleChange={(t) => updateTitle('gaps', t)}
              />
            )}

            {activeVisualization === 'peers' && (
              <PeerComparison
                peerData={peerData}
                industryName={industryBenchmark.name}
                title={customTitles.peers}
                onTitleChange={(t) => updateTitle('peers', t)}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;
