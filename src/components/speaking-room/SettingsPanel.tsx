'use client';

import React from 'react';
import { SpeakingSettings } from '@/types/speaking-room';
import { Button } from '@/components/ui/Button';

interface SettingsPanelProps {
  settings: SpeakingSettings;
  onSettingsChange: (settings: Partial<SpeakingSettings>) => void;
  onClose: () => void;
}

export default function SettingsPanel({
  settings,
  onSettingsChange,
  onClose
}: SettingsPanelProps) {
  const textDisplayModes = [
    { value: 'always', label: 'Always Show Text', description: 'See AI responses as both voice and text' },
    { value: 'voice-only', label: 'Voice Only', description: 'Listening challenge - audio only' },
    { value: 'toggle', label: 'Show on Demand', description: 'Click to reveal text when needed' }
  ] as const;

  const handleSpeedChange = (speed: number) => {
    onSettingsChange({ voiceSpeed: speed });
  };

  const handleTextModeChange = (mode: SpeakingSettings['textDisplayMode']) => {
    onSettingsChange({ textDisplayMode: mode });
  };

  const handleToggleChange = (key: keyof SpeakingSettings, value: boolean) => {
    onSettingsChange({ [key]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Speaking Settings</h3>
        <Button
          onClick={onClose}
          variant="ghost"
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </Button>
      </div>

      {/* Text Display Mode */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Text Display</h4>
        <div className="space-y-2">
          {textDisplayModes.map((mode) => (
            <label
              key={mode.value}
              className="flex items-start p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <input
                type="radio"
                name="textDisplayMode"
                value={mode.value}
                checked={settings.textDisplayMode === mode.value}
                onChange={() => handleTextModeChange(mode.value)}
                className="mt-1 mr-3"
              />
              <div>
                <div className="font-medium text-gray-900">{mode.label}</div>
                <div className="text-sm text-gray-600">{mode.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Voice Speed */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Voice Speed</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">0.5x</span>
            <span className="text-sm font-medium text-gray-900">{settings.voiceSpeed}x</span>
            <span className="text-sm text-gray-600">1.5x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.1"
            value={settings.voiceSpeed}
            onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Slower</span>
            <span>Normal</span>
            <span>Faster</span>
          </div>
        </div>
      </div>

      {/* Voice Options */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Voice Options</h4>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Auto-play AI Response</div>
              <div className="text-sm text-gray-600">Automatically play AI voice responses</div>
            </div>
            <input
              type="checkbox"
              checked={settings.autoPlayResponse}
              onChange={(e) => handleToggleChange('autoPlayResponse', e.target.checked)}
              className="toggle-checkbox"
            />
          </label>

          <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Enable Voice Recording</div>
              <div className="text-sm text-gray-600">Use microphone for voice input</div>
            </div>
            <input
              type="checkbox"
              checked={settings.enableRecording}
              onChange={(e) => handleToggleChange('enableRecording', e.target.checked)}
              className="toggle-checkbox"
            />
          </label>
        </div>
      </div>

      {/* Current Category Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <span className="text-2xl mr-3">{settings.selectedCategory.icon}</span>
          <div>
            <h5 className="font-medium text-blue-900">{settings.selectedCategory.name}</h5>
            <p className="text-sm text-blue-700">{settings.selectedCategory.description}</p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={onClose}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
} 