import { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { searchApi } from '../src/api/search';
import ArticleCard from '../src/components/ArticleCard';
import LoadingSpinner from '../src/components/LoadingSpinner';
import EmptyState from '../src/components/EmptyState';
import type { Article } from '../src/types';

export default function SearchScreen() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  // 获取热门搜索关键词
  const { data: hotKeywords } = useQuery({
    queryKey: ['hotKeywords'],
    queryFn: () => searchApi.getHotKeywords(10),
    select: (data) => data.data || [],
  });

  // 搜索结果
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['search', searchKeyword],
    queryFn: ({ pageParam = 1 }) =>
      searchApi.search({ keyword: searchKeyword, page: pageParam, size: 20 }),
    getNextPageParam: (lastPage) => {
      const { page, total_pages } = lastPage.data;
      return page < total_pages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!searchKeyword,
  });

  const articles = data?.pages.flatMap((page) => page.data.items) || [];

  const handleSearch = useCallback(() => {
    Keyboard.dismiss();
    if (keyword.trim()) {
      setSearchKeyword(keyword.trim());
    }
  }, [keyword]);

  const handleHotKeyword = (kw: string) => {
    setKeyword(kw);
    setSearchKeyword(kw);
    Keyboard.dismiss();
  };

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderItem = ({ item }: { item: Article }) => (
    <ArticleCard article={item} style={{ marginHorizontal: 16, marginBottom: 12 }} />
  );

  const renderHeader = () => {
    if (searchKeyword) return null;

    return (
      <View className="px-4 py-4">
        {/* 热门搜索 */}
        {hotKeywords && hotKeywords.length > 0 && (
          <View>
            <Text className="text-lg font-bold text-gray-800 mb-3">热门搜索</Text>
            <View className="flex-row flex-wrap gap-2">
              {hotKeywords.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  className="bg-gray-100 px-4 py-2 rounded-full"
                  onPress={() => handleHotKeyword(item.keyword)}
                >
                  <Text className="text-gray-600">{item.keyword}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderFooter = () => {
    if (!searchKeyword) return null;

    if (isFetchingNextPage) {
      return <LoadingSpinner size="small" />;
    }
    if (!hasNextPage && articles.length > 0) {
      return (
        <Text className="text-center text-gray-400 py-4">没有更多结果了</Text>
      );
    }
    return null;
  };

  const renderEmpty = () => {
    if (!searchKeyword) return null;

    if (isLoading) {
      return <LoadingSpinner />;
    }
    return (
      <EmptyState
        icon="search-outline"
        title="未找到相关内容"
        description={`没有找到与"${searchKeyword}"相关的内容`}
      />
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View className="flex-1 bg-background">
        {/* 搜索栏 */}
        <View className="bg-white pt-14 pb-3 px-4 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>

          <View className="flex-1 bg-gray-100 rounded-full flex-row items-center px-4">
            <Ionicons name="search-outline" size={20} color="#9ca3af" />
            <TextInput
              className="flex-1 py-2.5 px-2 text-base text-gray-800"
              placeholder="搜索文章、用户..."
              placeholderTextColor="#9ca3af"
              value={keyword}
              onChangeText={setKeyword}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              autoFocus
            />
            {keyword.length > 0 && (
              <TouchableOpacity onPress={() => setKeyword('')}>
                <Ionicons name="close-circle" size={20} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity onPress={handleSearch} className="ml-3">
            <Text className="text-primary-500 font-medium">搜索</Text>
          </TouchableOpacity>
        </View>

        {/* 搜索结果或热门搜索 */}
        <FlatList
          data={searchKeyword ? articles : []}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 20, flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        />
      </View>
    </>
  );
}
