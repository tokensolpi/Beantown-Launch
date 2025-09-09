import React, { useEffect, useRef, useState } from 'react';
import { SuperDatafeed } from '../../services/bitquery/SuperDatafeed';

// Declare the TradingView widget constructor on the window object
declare const TradingView: any;

interface SuperTradingViewChartProps {
  tokenAddress: string;
  chain: string;
  protocols?: string[];
  showLaunchData?: boolean;
}

// Mock function to simulate fetching launch event data
const fetchLaunchEvents = async (tokenAddress: string) => {
    console.log(`Fetching launch events for ${tokenAddress}`);
    // In a real app, this would be an API call.
    // Simulating a token launch event from 2 days ago.
    const twoDaysAgo = (new Date().getTime() / 1000) - (48 * 60 * 60);
    return Promise.resolve([
        { timestamp: twoDaysAgo, type: 'Token Launch' }
    ]);
};


const SuperTradingViewChart: React.FC<SuperTradingViewChartProps> = ({ 
  tokenAddress, 
  chain, 
  protocols = ['jupiter', 'fluid', 'wormhole'],
  showLaunchData = true 
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [tvWidget, setTvWidget] = useState<any>(null);

  const addProtocolOverlays = async (widget: any) => {
    // Jupiter DEX volume overlay
    if (protocols.includes('jupiter')) {
      widget.activeChart().createStudy('Volume', false, false, {
        'volume ma': false,
        'volume ma length': 20,
        'show ma': false
      });
    }

    // Example for a custom Wormhole bridge volume indicator
    if (protocols.includes('wormhole')) {
      // In a real scenario, you might create a custom study for cross-chain flow.
      console.log("Wormhole protocol overlay would be added here.");
    }
  };

  const addLaunchEventMarkers = async (widget: any) => {
    // Add launch event markers from Jupiter Launchpad
    const launchEvents = await fetchLaunchEvents(tokenAddress);
    
    const markers = launchEvents.map(event => ({
        time: event.timestamp,
        position: 'belowBar' as const,
        color: '#34d399', // Using theme-consistent green
        shape: 'arrowUp' as const,
        text: `🚀 ${event.type}`
    }));

    if (markers.length > 0) {
        widget.activeChart().setMarkers(markers);
    }
  };

  useEffect(() => {
    if (!chartContainerRef.current || typeof TradingView === 'undefined') {
        console.error("TradingView library not loaded or container not found.");
        return;
    }

    const datafeed = new SuperDatafeed({
      // In a real app, use a secure way to handle API keys
      apiKey: 'YOUR_BITQUERY_API_KEY', 
      tokenAddress,
      chain,
      protocols,
      enableLaunchpadData: showLaunchData
    });

    const widgetOptions = {
      symbol: `${tokenAddress}/${chain.toUpperCase()}`,
      datafeed: datafeed,
      interval: '60', // 1 hour
      container: chartContainerRef.current,
      library_path: '/tradingview/',
      locale: 'en',
      disabled_features: ['use_localstorage_for_settings'],
      enabled_features: [
        'study_templates',
        'create_volume_indicator_by_default',
        'side_toolbar_in_fullscreen_mode',
        'header_compare',
        'compare_symbol'
      ],
      charts_storage_url: 'https://saveload.tradingview.com',
      charts_storage_api_version: '1.1',
      client_id: 'multichain-defi-app',
      user_id: 'defi_user',
      fullscreen: false,
      autosize: true,
      theme: 'Dark',
      overrides: {
        "paneProperties.background": "#1f2937", // gray-800
        "paneProperties.backgroundType": "solid",
        "paneProperties.vertGridProperties.color": "#374151", // gray-700
        "paneProperties.horzGridProperties.color": "#374151", // gray-700
        "symbolWatermarkProperties.transparency": 90,
        "scalesProperties.textColor": "#9ca3af", // gray-400
        "mainSeriesProperties.candleStyle.upColor": "#34d399", // green-400
        "mainSeriesProperties.candleStyle.downColor": "#f87171", // red-400
        "mainSeriesProperties.candleStyle.borderUpColor": "#34d399",
        "mainSeriesProperties.candleStyle.borderDownColor": "#f87171",
        "mainSeriesProperties.candleStyle.wickUpColor": "#34d399",
        "mainSeriesProperties.candleStyle.wickDownColor": "#f87171",
      }
    };

    const widget = new TradingView.widget(widgetOptions);

    widget.onChartReady(() => {
      console.log('Super DeFi Chart Ready!');
      // Add protocol-specific overlays
      addProtocolOverlays(widget);
      
      // Add launch event markers
      if (showLaunchData) {
        addLaunchEventMarkers(widget);
      }
      
      setTvWidget(widget);
    });

    return () => {
      if (widget) {
        widget.remove();
      }
    };
  }, [tokenAddress, chain, protocols, showLaunchData]);


  return (
    <div className="trading-chart-container h-[500px] rounded-xl overflow-hidden bg-gray-800">
      <div 
        ref={chartContainerRef} 
        className="chart-widget w-full h-full"
      />
    </div>
  );
};

export default SuperTradingViewChart;