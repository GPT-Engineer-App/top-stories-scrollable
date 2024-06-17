import React, { useEffect, useState } from "react";
import { Container, VStack, Text, Link, Input, Box, Switch, useColorMode } from "@chakra-ui/react";
import axios from "axios";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    const fetchTopStories = async () => {
      try {
        const topStories = await axios.get("https://hacker-news.firebaseio.com/v0/topstories.json");
        const topFiveStoryIds = topStories.data.slice(0, 5);
        const storyPromises = topFiveStoryIds.map(id => axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`));
        const storiesData = await Promise.all(storyPromises);
        setStories(storiesData.map(story => story.data));
        setFilteredStories(storiesData.map(story => story.data));
      } catch (error) {
        console.error("Error fetching top stories:", error);
      }
    };

    fetchTopStories();
  }, []);

  useEffect(() => {
    setFilteredStories(
      stories.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, stories]);

  return (
    <Container centerContent maxW="container.md" py={4}>
      <Box display="flex" justifyContent="space-between" width="100%" mb={4}>
        <Text fontSize="2xl">Hacker News Top Stories</Text>
        <Box>
          <Text as="span" mr={2}>Dark Mode</Text>
          <Switch isChecked={colorMode === "dark"} onChange={toggleColorMode} />
        </Box>
      </Box>
      <Input
        placeholder="Search stories..."
        mb={4}
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <VStack spacing={4} width="100%">
        {filteredStories.map(story => (
          <Box key={story.id} p={4} borderWidth="1px" borderRadius="md" width="100%">
            <Text fontSize="lg" fontWeight="bold">
              <Link href={story.url} isExternal>
                {story.title}
              </Link>
            </Text>
            <Text>Upvotes: {story.score}</Text>
          </Box>
        ))}
      </VStack>
    </Container>
  );
};

export default Index;