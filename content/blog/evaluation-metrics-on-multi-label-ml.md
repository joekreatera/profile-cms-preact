---
title: "Evaluation metrics on multi label ML "
date: 2020-04-25T13:23:52.935Z
subtitle: Towards multi label decision tree evaluation
tags: machnine-learning decision-tree research
---
Evaluation metrics on multi label machine learning methods. Mainly, there are 7 metrics that are common to almost every research paper:

* Precision
* Recall
* Accuracy
* F1 score
* Average Precision
* Hamming los
* AUC (Area under ROC Curve) (method) The following document lacks the common value of each metric.

All of the above are based on the following principles of the confusion matrix:

| Concept              | Description                                                                |
| -------------------- | -------------------------------------------------------------------------- |
| True positives (TP)  | well tagged instances setting true on a label that was actually true       |
| True Negatives (TN)  | well untagged instances setting false on a label that was actually false   |
| False Positives (FP) | imprecise tagged instances setting true on a label that was actually false |
| False Negatives (FN) | imprecise tagged instances setting false on a label that was actually true |

- - -

### Warning

These methods were set up for single label classification so, the implementation details when done with a multilabel problem should consider:

1. Separating per class/label
2. Counting per instance and then averaging the results It is unclear whether research papers take number 1 or 2 being more probable the former (conjecture). According to one of the research papers on DRIVE, these metrics were designed for image-annotation procedures that may seem like multi-label problems. 

- - -

## Precision (Positive predictive value)

Precision measures only the correct tags (true tag) overall. 

![formula](https://render.githubusercontent.com/render/math?math=Precision\=\frac{TP}{TP+FP})

This measures how many correct labeled instances were done according to each instance. If FP are 0, then Precision is 100%. If TP = 0, then FP is a total wrong vector, hence, precision becomes 0.  False positive can be understood as the wrong answers. If this number grows, the other will become a lot less. 

## Recall (True Positive Rate)

This metric measures the correct label vector divided by the entire correct positive and negative labels. 

![formula](https://render.githubusercontent.com/render/math?math=Recall\ =\ \frac{TP}{TP%2bTN})

The more TP is, the less TN will be. Either way, recall will set the index of how many tags an instance really has, and how many of them were done right. As TN grows, the database has less tagged instances, and should be checked. 

## Accuracy

Maybe the most logical way of qualifying methods, measures the correct true/false tags divided by the sum of all confusion matrix values. 

![formula](https://render.githubusercontent.com/render/math?math=Accuracy\ =\ \frac{TP%2bTN}{TP%2bTN%2bFP%2bFN})

If TP and TN are low, FP and FN should be high setting the Accuracy towards 0. On the other hand, if TP and TN are high, FP and FN should be low, getting the index towards 1. 

## F1 score

This metric allows measurement of precision and sensitivity applying a harmonic mean. 

![formula](https://render.githubusercontent.com/render/math?math=F1\ score\ =\ 2*\frac{Precision*Recall}{Precision%2bRecall})

![formula](https://render.githubusercontent.com/render/math?math=F1\ score\ =\ \frac{2TP}{2TP%2bFP%2bFN})

## Average precision

The recall and precision could be graphed for each of the instances.  Sorting the elements according to recall and then replacing each precision value with the greatest value to the right will set everything for the method to work.
As recall cannot reach a number higher than 1, 11 levels (commonly) are taken into practice (from 0 to 1, each 0.1, 11 indices). Applying the following formula:

![formula](https://render.githubusercontent.com/render/math?math=Average\ precision=\int_{0}^{1}P\left(r\right)dr)

**P(r)** is the precision at recall r. Mathematically, and taking into account the method described previously, the formula P(r) becomes:

max p( ![formula](https://render.githubusercontent.com/render/math?math=\widetilde{r}) ) provided that  ![formula](https://render.githubusercontent.com/render/math?math=\widetilde{r})  ![formula](https://render.githubusercontent.com/render/math?math={r})

With the integral defined from 0 to 1 with dr=1/11 (0 and 1 inclusive in the domain)0, P(r) is the precision or height of the graph defined at r. The graph becomes a series of rectangles and the areas are dr*P(r) . Then:

![formula](https://render.githubusercontent.com/render/math?math=Average\ precision=\ \sum_{0}^{i=10}{\frac{1}{11}P(r_i)\ =\ }\frac{1}{11}\sum_{0}^{i=10}{P(r_i)\ })

## Hamming loss

Being created for the multi-label case, it relates the total number of instances and labels, identifying the cases in which a bad assignment was done (whether it is FN or FP). This method will count only when the predicted label and real label are different.

![formula](https://render.githubusercontent.com/render/math?math=Hamming\ Loss=\ \frac{1}{\left|N\right|\left|L\right|}\sum_{0}^{i=\left|N\right|}{\sum_{0}^{i=\left|L\right|}{Y_{i,j}{xor}{Y^\prime}_{i,j}}}) 

Where:

N = total number of instances

L= total number of labels (one-hot encoded)

Y=instance (i) with (label j) 1/0 real tag

Y’=instance(i) with (label j) 1/0 predicted tag

By the formula, it is clear that Hamming Loss will count (XOR) only when predicted values and real values are different. Once the number is calculated it will be divided by the total number of cases NxL that are in the database. The higher HL is, the worse the method becomes. 

## AUC

Area under ROC (receiver open characteristic) curve takes into account two simple parameter and then integrates the function to get the index. 

When having experimentation with cases in which the classification threshold is variated, the True Positive Rate and False Positive Rate can be graphed and interpolated to get a curve. The area under this curve is the AUC index that shows the probability that the model ranks a random positive example higher than a random negative example. Given this, AUC index evaluates how well an algorithm classifies true positive instances. 

To get it, first the True Positive Rate and False Positive Rate for each case are calculated.

![formula](https://render.githubusercontent.com/render/math?math=TruePositiveRate\ =\frac{TP}{TP%2bFN}\ ,\ FalsePositiveRate\ =\frac{FP}{FP%2bTN}\)

Then, order the cases by False Positive Rate and get the interpolated graph. Once it is done, get the integral of TruePositiveRate  = f(FalsePositiveRate) function, and the result is the AUC index.  A higher AUC means a successful method.  

- - -

Hope this methods help.

![](/assets/joeLogoStroke.png)