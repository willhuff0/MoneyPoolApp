import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, StyleSheet, Pressable, TextInput, Alert, Modal, FlatList, ActivityIndicator, SafeAreaView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
//for API calls
import { useSdk, useApi } from "@/api/api-provider";
import { Pool, User } from "@money-pool-app/shared";

export const withoutElement = (map: Map<string, any>, key: string): Map<string, any> => {
  let newMap = new Map(map);
  newMap.delete(key);
  return newMap;
}

export const withElement = (map: Map<string, any>, key: string, value: any): Map<string, any> => {
  let newMap = new Map(map);
  newMap.set(key, value);
  return newMap;
}

export default function ManagePool() {
  const router = useRouter();
  const { poolId } = useLocalSearchParams();
  const sdk = useSdk();
  const { activeUser, refreshUser } = useApi();
  
  const [pool, setPool] = useState<Pool | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [isOwner, setIsOwner] = useState(true);
  const [userNames, setUserNames] = useState<Map<string, {userName: string, displayName: string}>>(new Map());
  const [addingMember, setAddingMember] = useState(false);
  const [removingMember, setRemovingMember] = useState(false);
  const [isAddMemberModalVisible, setIsAddMemberModalVisible] = useState(false);
  const [friends, setFriends] = useState<User[]>([]);
  const [selectedFriendIds, setSelectedFriendIds] = useState<Set<string>>(new Set());
  const [friendSearchQuery, setFriendSearchQuery] = useState("");
  const [loadingFriends, setLoadingFriends] = useState(false);

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
          await Promise.all(Array.from(pools.at(0)!.members.keys()).map(async (id) => {
            const user = await sdk.user.getUser(id);
            if (user) newUserNames.set(id, {userName: user.userName, displayName: user.displayName});
          }));
          setUserNames(newUserNames);
        }
      } catch (error) {
        setError(String(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [poolId]);

  useEffect(() => {
    if (isAddMemberModalVisible && isOwner) {
      fetchFriends();
    }
  }, [isAddMemberModalVisible, isOwner]);

  const fetchFriends = async () => {
    if (!activeUser?.friends) return;
    
    setLoadingFriends(true);
    try {
      const friendIds = activeUser.friends;
      const users: User[] = [];
      
      await Promise.all(friendIds.map(async (id) => {
        try {
          // Skip if already in pool
          if (pool?.members.has(id)) return;
          
          const u = await sdk.user.getUser(id);
          if (u) users.push(u);
        } catch (e) {
          console.warn(`Failed to fetch user ${id}`, e);
        }
      }));
      
      setFriends(users);
    } catch (e) {
      console.error("Error fetching friends:", e);
    } finally {
      setLoadingFriends(false);
    }
  };

  const toggleFriendSelection = (userId: string) => {
    const newSelected = new Set(selectedFriendIds);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedFriendIds(newSelected);
  };

  const handleAddSelectedMembers = async () => {
    if (selectedFriendIds.size === 0) return;
    
    setAddingMember(true);
    let successCount = 0;
    let failCount = 0;
    
    try {
      const idsToAdd = Array.from(selectedFriendIds);
      
      for (const userId of idsToAdd) {
        try {
          const success = await sdk.pool.addMember(poolId as string, userId);
          if (success) {
            successCount++;
            // Update local state immediately for better UX
             const friend = friends.find(f => f.userId === userId);
             if (friend) {
                setPool(prev => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        members: withElement(prev.members, userId, 0)
                    }
                });
                setUserNames(prev => withElement(prev, userId, {
                    userName: friend.userName,
                    displayName: friend.displayName
                }));
             }
          } else {
            failCount++;
          }
        } catch (e) {
          console.error(`Failed to add member ${userId}`, e);
          failCount++;
        }
      }
      
      Alert.alert(
        "Result", 
        `Added ${successCount} member(s).${failCount > 0 ? ` Failed to add ${failCount}.` : ""}`
      );
      
      setIsAddMemberModalVisible(false);
      setSelectedFriendIds(new Set());
      setFriendSearchQuery("");
      
    } catch (e) {
      console.error("Error adding members:", e);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setAddingMember(false);
    }
  };

  async function handleRemoveMember(userId: string, displayName: string) {
    // Remove member directly using ID
    setRemovingMember(true);
    try {
      // Remove member from pool
      const success = await sdk.pool.removeMember(poolId as string, userId);
      
      if (success) {
        // Update members list
        setPool({
          ...pool!,
          members: withoutElement(pool!.members, userId),
        });
        setUserNames(withoutElement(userNames, userId));
        Alert.alert("Success", `${displayName} removed from pool`);
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
                refreshUser();
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
    router.replace(`/(root)/specificpool?poolId=${poolId}`);
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
                <View style={{ flex: 1 }}>
                  <Text style={styles.memberName}>{member.displayName}</Text>
                  <Text style={styles.memberUsername}>@{member.userName}</Text>
                </View>
                {userId === pool.ownerUserId ? (
                  <View style={styles.ownerBadge}>
                    <Text style={styles.ownerBadgeText}>Owner</Text>
                  </View>
                ) : isOwner ? (
                  <Pressable 
                    style={[styles.removeButton, removingMember && styles.disabledButton]} 
                    onPress={() => handleRemoveMember(userId, member.displayName)}
                    disabled={removingMember}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </Pressable>
                ) : null}
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
            <Pressable 
              style={styles.button} 
              onPress={() => setIsAddMemberModalVisible(true)}
            >
              <Text style={styles.buttonText}>Add Friends to Pool</Text>
            </Pressable>
          </View>

          {/* Button for deleting pool */}
          <View style={styles.section}>
            <Pressable style={styles.button} onPress={handleDeletePool}>
              <Text style={[styles.buttonText, { fontSize: 16 }]}>Delete Pool</Text>
            </Pressable>
          </View>
        </>
      )}
      <Modal
        visible={isAddMemberModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsAddMemberModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Friends</Text>
            <Pressable onPress={() => setIsAddMemberModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </Pressable>
          </View>
          
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search friends..."
              value={friendSearchQuery}
              onChangeText={setFriendSearchQuery}
              autoCapitalize="none"
            />
          </View>
          
          {loadingFriends ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1428A0" />
            </View>
          ) : (
            <FlatList
              data={friends.filter(f => 
                f.displayName.toLowerCase().includes(friendSearchQuery.toLowerCase()) || 
                f.userName.toLowerCase().includes(friendSearchQuery.toLowerCase())
              )}
              keyExtractor={item => item.userId}
              renderItem={({ item }) => (
                <Pressable 
                  style={[
                    styles.friendItem, 
                    selectedFriendIds.has(item.userId) && styles.selectedFriendItem
                  ]}
                  onPress={() => toggleFriendSelection(item.userId)}
                >
                  <View>
                    <Text style={[
                      styles.friendName,
                      selectedFriendIds.has(item.userId) && styles.selectedFriendText
                    ]}>{item.displayName}</Text>
                    <Text style={[
                      styles.friendUsername,
                      selectedFriendIds.has(item.userId) && styles.selectedFriendText
                    ]}>@{item.userName}</Text>
                  </View>
                  {selectedFriendIds.has(item.userId) && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </Pressable>
              )}
              ListEmptyComponent={
                <View style={styles.emptyList}>
                  <Text style={styles.emptyListText}>
                    {friends.length === 0 ? "No friends available to add" : "No matching friends found"}
                  </Text>
                </View>
              }
              contentContainerStyle={styles.listContent}
            />
          )}
          
          <View style={styles.modalFooter}>
            <Pressable 
              style={[styles.button, selectedFriendIds.size === 0 && styles.disabledButton]}
              onPress={handleAddSelectedMembers}
              disabled={selectedFriendIds.size === 0 || addingMember}
            >
              <Text style={styles.buttonText}>
                {addingMember ? "Adding..." : `Add Selected (${selectedFriendIds.size})`}
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>
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
  removeButton: {
    backgroundColor: "#FF4500",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  removeButtonText: {
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
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#F5F4F7",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButtonText: {
    color: "#1428A0",
    fontSize: 16,
    fontWeight: "600",
  },
  searchContainer: {
    padding: 16,
    backgroundColor: "#fff",
  },
  searchInput: {
    backgroundColor: "#F5F4F7",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 16,
  },
  friendItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectedFriendItem: {
    borderColor: "#1428A0",
    backgroundColor: "#F0F2FF",
  },
  friendName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  friendUsername: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  selectedFriendText: {
    color: "#1428A0",
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#1428A0",
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  emptyList: {
    padding: 32,
    alignItems: "center",
  },
  emptyListText: {
    color: "#888",
    fontSize: 16,
  },
  modalFooter: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
});
