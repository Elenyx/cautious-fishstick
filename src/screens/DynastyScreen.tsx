import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, SafeAreaView } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { generateFounders, createChild } from '../utils/dynasty';
import DynastyTree from '../components/DynastyTree';

export default function DynastyScreen() {
  const dynasty = useGameStore((s) => s.dynasty);
  const setDynasty = useGameStore((s) => s.setDynasty);
  const save = useGameStore((s) => s.save);
  const load = useGameStore((s) => s.load);
  const upsertCharacter = useGameStore((s) => s.upsertCharacter);

  const [roots, setRoots] = useState<string[]>([]);

  useEffect(() => {
    // attempt to load saved game
    load();
  }, []);

  const onGenerate = () => {
    const { characters, rootIds } = generateFounders();
    setDynasty(characters);
    setRoots(rootIds);
  };

  const onAddChild = () => {
    const parentIds = roots.slice(0, 2);
    if (!parentIds.length) return;
    const child = createChild(parentIds, { givenName: 'NewHeir' });
    upsertCharacter(child);
    // mutate parents to include child ids
    for (const pid of parentIds) {
      const p = (useGameStore.getState().dynasty || {})[pid];
      if (p) {
        p.childIds.push(child.id);
        upsertCharacter(p);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
        <Button title="Generate Founders" onPress={onGenerate} />
        <Button title="Add Child" onPress={onAddChild} />
        <Button title="Save" onPress={() => save()} />
      </View>

      <DynastyTree characters={dynasty} />

      <View style={{ marginTop: 12 }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>Raw dynasty (debug)</Text>
        <FlatList
          data={Object.values(dynasty)}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <View style={{ paddingVertical: 6 }}>
              <Text>{item.givenName} — {item.familyName} ({item.id.slice(0,6)})</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
