import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, StyleSheet, Pressable, TextInput, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
//for API calls
import { useSdk, useApi } from "@/api/api-provider";
import { Pool } from "@money-pool-app/shared";

export const withoutElement = (map: Map<string, any>, key: string): Map<string, any> => {
  let newMap = new Map(map);
  newMap.delete(key);
  return newMap;
}

export default function ManagePool() {
  const router = useRouter();
  const { poolId } = useLocalSearchParams();
  const sdk = useSdk();
  const { activeUser } = useApi();
  
  const [pool, setPool] = useState<Pool | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [isOwner, setIsOwner] = useState(true);
  const [userNames, setUserNames] = useState<Map<string, {userName: string, displayName: string}>>(new Map());
  const [addUsername, setAddUsername] = useState("");
  const [removeUsername, setRemoveUsername] = useState("");
  const [addingMember, setAddingMember] = useState(false);
  const [removingMember, setRemovingMember] = useState(false);

useEffect(() => {
    const fetchData = async () => {
      try {
        if (!poolId || typeof poolId !== 'string') return;

        const pools = await sdk.pool.getPools([poolId as string]);
        setPool(pools.at(0) ?? null);
        setIsOwner(pools.at(0)?.ownerUserId === activeUser!.userId);

        if (pools.at(0) == null) {
          setUserNames(new Map());
        } else {
          const newUserNames = new Map<string, {userName: string, displayName: string}>();
          await Promise.all(pools.at(0)!.members.keys().map(async (id) => {
            const user = await sdk.user.getUser(id);
            if (user) newUserNames.set(id, {userName: user.userName, displayName: user.displayName});
          }));
          setUserNames(newUserNames);
        }
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [poolId]);

  async function handleAddMember() {
    if (!addUsername.trim()) {
      Alert.alert("Error", "Please enter a username");
      return;
    }

    //Add member by searching username 
    setAddingMember(true);
    try {
      const user = await sdk.user.searchUser(addUsername.trim());
      
      if (!user) {
        Alert.alert("Error", "user not found");
        setAddingMember(false);
        return;
      }

      // Add member to pool
      const success = await sdk.pool.addMember(poolId as string, user.userId);
      
      if (success) {
        //Dynamic updates for members list 
        setPool({
          ...pool!,
          members: new Map({...pool!.members, [user.userId]: 0}),
        });
        setUserNames(new Map({...userNames, [user.userId]: user.userName}));
        setAddUsername("");
        Alert.alert("Success", `${user.displayName} added to pool`);
      } else {
        Alert.alert("Error", "Failed to add member");
      }
    } catch (e) {
      console.error("Error adding member:", e);
      Alert.alert("Error", "Failed to add member");
    } finally {
      setAddingMember(false);
    }
  }

  async function handleRemoveMember() {
    if (!removeUsername.trim()) {
      Alert.alert("Error", "Please enter a username");
      return;
    }

    //remove member by searching
    setRemovingMember(true);
    try {
      const user = await sdk.user.searchUser(removeUsername.trim());
      
      if (!user) {
        Alert.alert("Error", "User not found");
        setRemovingMember(false);
        return;
      }

      // Check if user is in the pool
      const memberExists = pool?.members.has(user.userId);
      if (!memberExists) {
        Alert.alert("Error", "User is not a member of this pool");
        setRemovingMember(false);
        return;
      }

      // Remove member from pool
      const success = await sdk.pool.removeMember(poolId as string, user.userId);
      
      if (success) {
        // Update members list
        setPool({
          ...pool!,
          members: withoutElement(pool!.members, user.userId),
        });
        setUserNames(withoutElement(userNames, user.userId));
        setRemoveUsername("");
        Alert.alert("Success", `${user.displayName} removed from pool`);
      } else {
        Alert.alert("Error", "Failed to remove member");
      }
    } catch (e) {
      console.error("Error removing member:", e);
      Alert.alert("Error", "Failed to remove member");
    } finally {
      setRemovingMember(false);
    }
  }

  async function handleDeletePool() {
    Alert.alert(
      "Delete Pool",
      "Are you sure you want to delete this pool? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const success = await sdk.pool.deletePool(poolId as string);
              if (success) {
                Alert.alert("Success", "Pool deleted successfully");
                router.replace("/(root)/poolslist");
              } else {
                Alert.alert("Error", "Failed to delete pool");
              }
            } catch (e) {
              console.error("Error deleting pool:", e);
              Alert.alert("Error", "Failed to delete pool");
            }
          },
        },
      ]
    );
  }

  function handleGoBack() {
    router.push(`/(root)/specificpool?poolId=${poolId}`);
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{String(error)}</Text>
      </View>
    );
  }

  if (!pool) {
    return (
      <View style={styles.container}>
        <Text>Pool not found</Text>
      </View>
    );
  }

  const userNameArray = Array.from(userNames.entries()); 

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.poolName}>{pool.displayName}</Text>
        <Pressable style={styles.button} onPress={handleGoBack}>
          <Text style={styles.buttonText}>Back</Text>
        </Pressable>
      </View>

      {/* Members List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Members ({userNames.size})</Text>
        {userNames.size === 0 ? (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>No members yet</Text>
          </View>
        ) : (
          <View style={styles.membersList}>
            {userNameArray.map(([userId, member]) => (
              <View key={userId} style={styles.memberItem}>
                <View>
                  <Text style={styles.memberName}>{member.displayName}</Text>
                  <Text style={styles.memberUsername}>@{member.userName}</Text>
                </View>
                {userId === pool.ownerUserId && (
                  <View style={styles.ownerBadge}>
                    <Text style={styles.ownerBadgeText}>Owner</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Owner-only sections */}
      {isOwner && (
        <>
          {/* Add Member Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add Member</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter member's username to add"
                value={addUsername}
                onChangeText={setAddUsername}
                autoCapitalize="none"
                editable={!addingMember}
              />
              <Pressable 
                style={[styles.button, styles.actionButton, addingMember && styles.disabledButton]} 
                onPress={handleAddMember}
                disabled={addingMember}
              >
                <Text style={styles.buttonText}>
                  {addingMember ? "Adding..." : "Add"}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Section for removing members */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Remove Member</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter member's username to remove"
                value={removeUsername}
                onChangeText={setRemoveUsername}
                autoCapitalize="none"
                editable={!removingMember}
              />
              <Pressable 
                style={[styles.button, styles.actionButton, removingMember && styles.disabledButton]} 
                onPress={handleRemoveMember}
                disabled={removingMember}
              >
                <Text style={styles.buttonText}>
                  {removingMember ? "Removing..." : "Remove"}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Button for deleting pool */}
          <View style={styles.section}>
            <Pressable style={styles.button} onPress={handleDeletePool}>
              <Text style={[styles.buttonText, { fontSize: 16 }]}>Delete Pool</Text>
            </Pressable>
          </View>
        </>
      )}
    </ScrollView>
  );
}

//Stylesheet cohesive with homepage design 
//Reused styles for header, container, buttons etc.
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F5F4F7",
    padding: 16,
  },
  header: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  poolName: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#1428A0",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  membersList: {
    gap: 8,
  },
  memberItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  memberUsername: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  ownerBadge: {
    backgroundColor: "#FF8C00",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  ownerBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  placeholder: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    color: "#888",
    fontStyle: "italic",
  },
  inputContainer: {
    flexDirection: "row",
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#F5F4F7",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  actionButton: {
    minWidth: 90,
    paddingHorizontal: 20,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
