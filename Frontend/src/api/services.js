import axiosInstance from "./axiosIntance";


export const getWords = () => axiosInstance.get("words");

export const getRandomWord = () => axiosInstance.get("random-word");

export const getAnswersMeaning = (correctAnswerId) =>
  axiosInstance.get(`answers-meanings/${correctAnswerId}`);

export const createWord = (word, meaning, description) =>
  axiosInstance.post("create-word", {
    word: word,
    meaning: meaning,
    description: description,
  });

export const updateWord = (editWord, editMeaning, editDescription, editId) =>
  axiosInstance.put(`update-word/${editId}`, {
    word: editWord,
    meaning: editMeaning,
    description: editDescription,
  });

export const updateTimesLearned = (wordId) =>
  axiosInstance.put(`update-times-learned/${wordId}`);

export const updateHideWord = (id, isHidden) =>
  axiosInstance.put(`update-hide-word/${id}/${isHidden}`);
