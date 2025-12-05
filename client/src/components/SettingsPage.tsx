import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { 
  Key, 
  Trash2, 
  Eye, 
  EyeOff, 
  Check, 
  Loader2,
  Sparkles,
  Image,
  ExternalLink
} from 'lucide-react';
import { SiOpenai } from 'react-icons/si';

interface ApiKeyInfo {
  id: string;
  provider: string;
  maskedKey: string;
}

const LLM_PROVIDERS = [
  { 
    id: 'openai', 
    name: 'OpenAI', 
    description: 'ChatGPT (GPT-4, GPT-4o)',
    icon: SiOpenai,
    docsUrl: 'https://platform.openai.com/api-keys',
    placeholder: 'sk-...'
  },
  { 
    id: 'anthropic', 
    name: 'Anthropic', 
    description: 'Claude (Claude 3.5 Sonnet)',
    icon: Sparkles,
    docsUrl: 'https://console.anthropic.com/settings/keys',
    placeholder: 'sk-ant-...'
  },
  { 
    id: 'google', 
    name: 'Google AI', 
    description: 'Gemini (Gemini 1.5 Flash)',
    icon: Sparkles,
    docsUrl: 'https://aistudio.google.com/app/apikey',
    placeholder: 'AI...'
  },
];

const IMAGE_PROVIDERS = [
  { 
    id: 'pexels', 
    name: 'Pexels', 
    description: 'Free stock photos',
    icon: Image,
    docsUrl: 'https://www.pexels.com/api/',
    placeholder: 'Your Pexels API key'
  },
  { 
    id: 'unsplash', 
    name: 'Unsplash', 
    description: 'Beautiful free images',
    icon: Image,
    docsUrl: 'https://unsplash.com/developers',
    placeholder: 'Your Unsplash Access Key'
  },
  { 
    id: 'pixabay', 
    name: 'Pixabay', 
    description: 'Free images and videos',
    icon: Image,
    docsUrl: 'https://pixabay.com/api/docs/',
    placeholder: 'Your Pixabay API key'
  },
];

function ApiKeyCard({ 
  provider, 
  existingKey, 
  onSave, 
  onDelete,
  isSaving 
}: { 
  provider: typeof LLM_PROVIDERS[0];
  existingKey?: ApiKeyInfo;
  onSave: (key: string) => void;
  onDelete: () => void;
  isSaving: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [keyValue, setKeyValue] = useState('');

  const handleSave = () => {
    if (keyValue.trim().length >= 10) {
      onSave(keyValue.trim());
      setKeyValue('');
      setIsEditing(false);
    }
  };

  const Icon = provider.icon;

  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base">{provider.name}</CardTitle>
              <CardDescription className="text-sm">{provider.description}</CardDescription>
            </div>
          </div>
          {existingKey && (
            <Badge variant="secondary" className="shrink-0">
              <Check className="w-3 h-3 mr-1" />
              Connected
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {existingKey && !isEditing ? (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
              <Key className="w-4 h-4" />
              {showKey ? existingKey.maskedKey : '••••••••••••'}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setShowKey(!showKey)}
                data-testid={`button-toggle-key-${provider.id}`}
              >
                {showKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditing(true)}
                data-testid={`button-edit-key-${provider.id}`}
              >
                Update
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onDelete}
                className="text-destructive"
                data-testid={`button-delete-key-${provider.id}`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor={`key-${provider.id}`}>API Key</Label>
              <Input
                id={`key-${provider.id}`}
                type="password"
                placeholder={provider.placeholder}
                value={keyValue}
                onChange={(e) => setKeyValue(e.target.value)}
                data-testid={`input-api-key-${provider.id}`}
              />
            </div>
            <div className="flex items-center justify-between">
              <a 
                href={provider.docsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary flex items-center gap-1 hover:underline"
              >
                Get API Key <ExternalLink className="w-3 h-3" />
              </a>
              <div className="flex items-center gap-2">
                {isEditing && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setIsEditing(false);
                      setKeyValue('');
                    }}
                  >
                    Cancel
                  </Button>
                )}
                <Button 
                  size="sm"
                  onClick={handleSave}
                  disabled={keyValue.length < 10 || isSaving}
                  data-testid={`button-save-key-${provider.id}`}
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Key'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function SettingsPage() {
  const { toast } = useToast();

  const { data: apiKeys = [], isLoading } = useQuery<ApiKeyInfo[]>({
    queryKey: ['/api/user/api-keys'],
  });

  const saveKeyMutation = useMutation({
    mutationFn: async ({ provider, apiKey }: { provider: string; apiKey: string }) => {
      const response = await apiRequest('POST', '/api/user/api-keys', { provider, apiKey });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save API key');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/api-keys'] });
      toast({ title: 'API key saved', description: 'Your API key has been securely stored.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const deleteKeyMutation = useMutation({
    mutationFn: async (provider: string) => {
      const response = await apiRequest('DELETE', `/api/user/api-keys/${provider}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete API key');
      }
      return provider;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/api-keys'] });
      toast({ title: 'API key removed', description: 'Your API key has been deleted.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const getExistingKey = (providerId: string) => {
    return apiKeys.find(k => k.provider === providerId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold" data-testid="text-settings-title">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your API keys for AI copy generation and stock images
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            AI Copy Providers
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Connect your preferred AI service to generate sales copy
          </p>
        </div>
        <div className="grid gap-4">
          {LLM_PROVIDERS.map(provider => (
            <ApiKeyCard
              key={provider.id}
              provider={provider}
              existingKey={getExistingKey(provider.id)}
              onSave={(key) => saveKeyMutation.mutate({ provider: provider.id, apiKey: key })}
              onDelete={() => deleteKeyMutation.mutate(provider.id)}
              isSaving={saveKeyMutation.isPending}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Image className="w-5 h-5" />
            Stock Image Providers
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Connect to search and add royalty-free images to your pages
          </p>
        </div>
        <div className="grid gap-4">
          {IMAGE_PROVIDERS.map(provider => (
            <ApiKeyCard
              key={provider.id}
              provider={provider}
              existingKey={getExistingKey(provider.id)}
              onSave={(key) => saveKeyMutation.mutate({ provider: provider.id, apiKey: key })}
              onDelete={() => deleteKeyMutation.mutate(provider.id)}
              isSaving={saveKeyMutation.isPending}
            />
          ))}
        </div>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Key className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Your keys are secure</p>
              <p className="mt-1">
                API keys are encrypted with AES-256 encryption and stored securely. 
                We never share your keys or use them for any purpose other than the features you request.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
