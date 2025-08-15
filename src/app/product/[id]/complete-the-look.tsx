"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wand2 } from 'lucide-react';
import { getCompleteTheLookSuggestions } from '@/app/actions';

interface CompleteTheLookProps {
    productDescription: string;
}

export default function CompleteTheLook({ productDescription }: CompleteTheLookProps) {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGetSuggestions = async () => {
        setIsLoading(true);
        setError(null);
        setSuggestions([]);
        const result = await getCompleteTheLookSuggestions({ productDescription });
        if (result.success) {
            setSuggestions(result.suggestions || []);
        } else {
            setError(result.error || "An unknown error occurred.");
        }
        setIsLoading(false);
    };

    return (
        <div className="mt-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline text-xl">
                        <Wand2 className="w-6 h-6 text-primary" />
                        <span>Complete the Look</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm mb-4">
                        Let our AI stylist suggest complementary items for this product.
                    </p>
                    <Button onClick={handleGetSuggestions} disabled={isLoading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating Ideas...
                            </>
                        ) : (
                             "Get Suggestions"
                        )}
                    </Button>
                    
                    {error && <p className="text-destructive text-sm mt-4">{error}</p>}
                    
                    {suggestions.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-semibold mb-2">We suggest adding:</h4>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                {suggestions.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
