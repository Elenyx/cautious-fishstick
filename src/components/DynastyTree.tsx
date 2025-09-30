import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Character } from '../utils/dynasty';

export default function DynastyTree({ characters }: { characters: Record<string, Character> }) {
  const items = Object.values(characters);
  if (!items.length) return (
    <View style={{ padding: 12 }}>
      <Text>No dynasty data. Tap "Generate Founders" to create a sample family.</Text>
    </View>
  );

  return (
    <ScrollView style={{ flex: 1 }} horizontal>
      <View style={{ flexDirection: 'column', padding: 8 }}>
        {items.map((c) => (
          <View key={c.id} style={{ padding: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: 6 }}>
            <Text style={{ fontWeight: '600' }}>{c.givenName} {c.familyName}</Text>
            <Text>Children: {c.childIds.length}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
